import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { deleteImage, imageUpload } from '../services/imageUploadService';
import '../styles/ImageUpload.css';
import { Button, Ratio } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { getImageName } from '../utils/GetImageName';
import { Bounce, toast } from 'react-toastify';

const ImageUpload = ({ autoUpload = false, manualUpload = false, onImageUrl, existingImageUrl, isDelete }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(existingImageUrl || null); // State for preview
    const [isUploading, setIsUploading] = useState(false);


    // Handle file selection from dropzone
    const onDrop = (acceptedFiles) => {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);

        // Generate image preview URL
        const previewUrl = URL.createObjectURL(selectedFile);
        setPreview(previewUrl);

        // Automatically upload if autoUpload is true
        if (autoUpload) {
            handleUpload(selectedFile);
        }
    };

    // Set up dropzone configuration
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*',
        maxFiles: 1, // Accept only one file at a time
    });

    // Function to handle the upload
    const handleUpload = async (fileToUpload) => {
        setIsUploading(true);

        // Create FormData to send as multipart/form-data
        const formData = new FormData();
        formData.append('image', fileToUpload);

        try {

            // Check if there is an existing image URL and the delete flag is set to true
            if (existingImageUrl && isDelete) {
                const imageName = getImageName(existingImageUrl);
                try {
                    // Attempt to delete the previous image
                    await deleteImage(imageName);
                } catch (error) {
                    console.error(`Failed to delete image: ${imageName}`, error);
                }
            }
            // Call the imageUpload function from the service
            const result = await imageUpload(formData);
            if (result && result?.data?.imageUrl) {
                onImageUrl(result?.data?.imageUrl);
            }
            // Show success toast
            toast.success('Image uploaded successfully', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Upload Failed',
                text: 'Something went wrong. Please try again.' + err,
                confirmButtonText: 'Retry',
            });
        } finally {
            setIsUploading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            Swal.fire({
                icon: 'warning',
                title: 'No File Selected',
                text: 'Please choose an image file before proceeding with the upload.',
                confirmButtonText: 'Got It!',
            });
            return;
        }
        handleUpload(file);
    };

    // Function to convert bytes to kilograms
    const formatFileSize = (size) => {
        if (size < 1000) return `${size} bytes`;
        else if (size < 1000000) return `${(size / 1000).toFixed(1)} KB`;
        else return `${(size / 1000000).toFixed(1)} MB`;
    };


    return (
        <div>
            <div>
                <div
                    {...getRootProps()}
                    className="dropzone"
                    style={{
                        border: '2px dashed #ddd',
                        padding: '20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                    }}
                >
                    <input {...getInputProps()} />
                    {file || preview ? (
                        <div className="position-relative d-flex justify-content-center align-items-center overflow-hidden">
                            <Ratio aspectRatio="1x1">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    style={{
                                        maxWidth: '100%',
                                        height: 'auto',
                                        border: '2px solid #ddd',
                                    }}
                                />
                            </Ratio>
                            {file && (
                                <div className="position-absolute hover-text">
                                    <p className='mb-0'><strong>Type:</strong> {file.type}</p>
                                    <p className='mb-0'><strong>Size:</strong> {formatFileSize(file.size)}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p>Drag & drop</p>
                        // <p>Drag & drop an image here, or click to select</p>
                    )}
                </div>

                {manualUpload && (
                    <Button onClick={handleSubmit} variant="primary" type="submit" disabled={isUploading} className='my-3 w-100'>
                        {isUploading ? 'Uploading...' : 'Upload Image'}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
