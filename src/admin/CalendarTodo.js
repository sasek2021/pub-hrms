// CalendarTodo.js

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/CalendarTodo.css'; // You can create a CSS file for styling

const CalendarTodo = () => {
    const [date, setDate] = useState(new Date());
    const [todos, setTodos] = useState([]);
    const [todoInput, setTodoInput] = useState('');

    const handleDateChange = (newDate) => {
        setDate(newDate);
    };

    const handleTodoChange = (event) => {
        setTodoInput(event.target.value);
    };

    const addTodo = () => {
        if (todoInput) {
            setTodos([...todos, { text: todoInput, date: date.toDateString() }]);
            setTodoInput('');
        }
    };

    return (
        <div className="calendar-todo-container">
            <h2>Calendar & Todo</h2>
            <div className="calendar-section">
                <Calendar
                    onChange={handleDateChange}
                    value={date}
                />
            </div>
            <div className="todo-section">
                <h3>Todo List for {date.toDateString()}</h3>
                <input
                    type="text"
                    value={todoInput}
                    onChange={handleTodoChange}
                    placeholder="Add a new todo"
                />
                <button onClick={addTodo}>Add</button>
                <ul>
                    {todos.filter(todo => todo.date === date.toDateString()).map((todo, index) => (
                        <li key={index}>{todo.text}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CalendarTodo;
