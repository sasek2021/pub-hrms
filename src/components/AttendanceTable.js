import React, { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid'; // Ensure you have @mui/x-data-grid installed
import { Badge } from "react-bootstrap";
import Swal from "sweetalert2";
import { deleteAttendanceByID, getAttendance } from "../services/attendanceService";
import { getFullName } from "../utils/getFullName";
import { formatDateTo12HourTime } from "../utils/formatDateTo12HourTime";
import { formatIsoToDate } from "../utils/formatIsoToDate";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddAttendanceModal from "./AddAttendanceModal";

const AttendanceTable = ({ filters, refresh }) => {
    const [selectedRows, setSelectedRows] = useState([]); // State for selected rows
    const [attendances, setAttendances] = useState([]);
    const [loadingAttendance, setLoadingAttendance] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [attendance, setAttendance] = useState({});

    const fetchAttendance = async () => {
        try {
            const response = await getAttendance(); // Adjust this function as needed
            // Add `company` and `manager` fields to each department
            const departmentsWithDetails = response?.data?.map(attendance => ({
                ...attendance,
                date: formatIsoToDate(attendance?.date),
                checkin: formatDateTo12HourTime(attendance?.check_in),
                checkout: formatDateTo12HourTime(attendance?.check_out),
                name: getFullName(attendance?.employee_id) || 'Unknown name', // Add company field, default if not provided
                department: attendance?.employee_id?.department_id?.name || 'Unknow department' // Add manager field, default if not provided
            }));
            setAttendances(departmentsWithDetails)
            setLoadingAttendance(false);
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: `An error occurred: ${err.response.data.message}`,
                confirmButtonText: "OK"
            });
            setLoadingAttendance(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    useEffect(() => {
        fetchAttendance();
    }, [refresh]);

    // Filter logic
    const filteredRecords = attendances.filter((record) => {
        return (
            (!filters.date || record.date === filters.date) &&
            (!filters.department || record.department === filters.department) &&
            (!filters.status || record.status === filters.status)
        );
    });

    const columns = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'department', headerName: 'Department', flex: 1 },
        { field: 'date', headerName: 'Date', flex: 1 },
        { field: 'checkin', headerName: 'Check In', flex: 1 },
        { field: 'checkout', headerName: 'Check Out', flex: 1 },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            renderCell: (params) => (
                <Badge bg={params.value === "Present" ? "success" : params.value === "Absent" ? "warning" : "danger"}>
                    {params.value}
                </Badge>
            )
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 0.6,
            renderCell: (params) => {
                return (
                    <div className='h-100 d-flex align-items-center g-2' style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleUpdateUpdateAttendance(params.row)}
                        >
                            <FaEdit />
                        </button>
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteAttendance(params.row._id, params.row.name)}
                        >
                            <FaTrash />
                        </button>
                    </div>
                );
            },
        },
    ];


    const handleSelectAllDeleteAttendance = async () => {
        try {
            const result = await Swal.fire({
                title: "Confirm Multiple Deletion",
                text: `Delete ${selectedRows.length} selected attendance?`,
                icon: "warning",
                showCancelButton: true,
            });

            if (result.isConfirmed) {
                Swal.fire({
                    title: "Deleting...",
                    text: "Please wait while we delete the attendance.",
                    icon: "info",
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                await Promise.all(selectedRows.map(id => deleteAttendanceByID(id)));
                fetchAttendance();
                setSelectedRows([]);
                Swal.fire("Deleted!", "Selected attendance deleted.", "success");
            }
        } catch (err) {
            Swal.fire("Error", `Failed to delete multiple: ${err.response.data.message}`, "error");
        }
    };

    const handleDeleteAttendance = async (id, name) => {
        try {
            const result = await Swal.fire({
                title: "Confirm Deletion",
                text: `Are you sure you want to delete the attendance "${name}"? This action cannot be undone.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "Cancel"
            });

            if (result.isConfirmed) {
                Swal.fire({
                    title: "Deleting...",
                    text: "Please wait while we delete the department.",
                    icon: "info",
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                await deleteAttendanceByID(id); // Perform the deletion

                Swal.fire({
                    title: "Deleted!",
                    text: "The attendance has been deleted successfully.",
                    icon: "success",
                    confirmButtonText: "OK"
                });

                fetchAttendance(); // Refresh attendance
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Deletion Failed",
                text: `An error occurred: ${err.response.data.message}`,
                confirmButtonText: "OK"
            });
        }
    };

    const handleUpdateUpdateAttendance = (params) => {
        if (params._id) {
            setAttendance(params);
        }
        setShowModal(true);
    };


    return (
        <>
            {selectedRows.length > 0 && (
                <button
                    className="btn btn-danger btn-sm mb-3 d-flex align-items-center"
                    onClick={handleSelectAllDeleteAttendance}
                >
                    <FaTrash className="pe-1" /> Delete Selected
                </button>
            )}

            <div style={{ height: 371, width: "100%" }}>
                <DataGrid
                    rows={filteredRecords}
                    columns={columns}
                    loading={loadingAttendance}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    getRowId={(row) => row?._id}
                    checkboxSelection
                    disableSelectionOnClick
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        setSelectedRows(newRowSelectionModel);
                    }}
                    componentsProps={{
                        pagination: {
                            className: 'custom-pagination' // Apply custom class here
                        },
                    }}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 5, page: 0 },
                        },
                    }}
                />
            </div>

            <AddAttendanceModal show={showModal} onHide={() => setShowModal(false)} data={attendance} />
        </>
    );
};

export default AttendanceTable;
