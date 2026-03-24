import React, { useState } from 'react';
import { db } from './firebase'; 
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore"; 

export default function TextForm() {
    const [text, setText] = useState("");
    const [history, setHistory] = useState(""); // State to store all pulled data

    // 1. Function to SAVE data (Each click creates a NEW entry)
    const handleOnSubmit = async () => {
        if (text.trim() === "") return;
        try {
            await addDoc(collection(db, "user_entries"), {
                content: text,
                timestamp: new Date()
            });
            setText(""); // Clear the top box after saving
            alert("Saved to Database!");
        } catch (e) {
            console.error("Error: ", e);
        }
    };

    // 2. Function to DISPLAY all data
    const handleDisplay = async () => {
        try {
            // We ask Firebase for the "user_entries" folder, sorted by time
            const q = query(collection(db, "user_entries"), orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(q);
            
            // We combine all the text pieces into one big string
            let allText = "";
            querySnapshot.forEach((doc) => {
                allText += `${doc.data().content}\n---\n`; 
            });
            
            setHistory(allText); // Put the big string into our second box
        } catch (e) {
            console.error("Error fetching: ", e);
        }
    };

    return (
        <div className="container mt-4">
            <h3>Input Area</h3>
            <textarea className="form-control" value={text} onChange={(e) => setText(e.target.value)} rows="4"></textarea>
            
            <div className="mt-2">
                <button className="btn btn-success me-2" onClick={handleOnSubmit}>Save to Firebase</button>
                <button className="btn btn-info" onClick={handleDisplay}>Display All History</button>
            </div>

            <hr />

            <h3>Database History</h3>
            <textarea 
                className="form-control bg-light" 
                value={history} 
                readOnly // This makes it so you can't type in the history box
                placeholder="Click 'Display' to see old data..."
                rows="8"
            ></textarea>
        </div>
    );
}