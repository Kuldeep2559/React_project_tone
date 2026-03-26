import React, { useState } from 'react';
import { db } from './firebase'; 
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore"; 
import { GoogleGenerativeAI } from "@google/generative-ai";
import { where, writeBatch, Timestamp } from "firebase/firestore";  // where, writeBatch and Timestamp only for deletion according to date.



export default function TextForm() {
    const [question, setQuestion] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [history, setHistory] = useState([]);

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

    const handleAskAI = async () => {
        if (!question) return;
        setAiResponse("Thinking...");

        try {
            // 1. Call Gemini AI
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            //const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
            const result = await model.generateContent(question);
            const responseText = result.response.text();
            setAiResponse(responseText);

            // 2. Save both Question & Answer to Firebase
            await addDoc(collection(db, "ai_chats"), {
                question: question,
                answer: responseText,
                timestamp: new Date()
            });

            setQuestion(""); // Clear input after saving
        } catch (error) {
            console.error("AI Error:", error);
            setAiResponse("Failed to get answer. Check your API key.");
        }
    };

    const fetchHistory = async () => {
        const q = query(collection(db, "ai_chats"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        setHistory(querySnapshot.docs.map(doc => doc.data()));
    };

    // delete history
    const deleteHistory = async (range) => 
    {
        const now = new Date();
        let startTime;

        if (range === '1h') {
            startTime = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago
            } else if (range === '1d') {
            startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
        }

        try {
        let q;
        const collectionRef = collection(db, "ai_chats");

        if (range === 'all') {
            q = query(collectionRef);
        } else {
            // Only select docs newer than the startTime
            q = query(collectionRef, where("timestamp", ">=", startTime));
        }

            const querySnapshot = await getDocs(q);
            const batch = writeBatch(db); // Using a batch is faster for deleting multiple items

            querySnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });

            await batch.commit();
            alert(`History for ${range} deleted!`);
            fetchHistory(); // Refresh the list so the deleted items disappear
        } catch (error) {
            console.error("Delete Error:", error);
        }
    };  // end of delete history function.

    return (
        <div className="container my-3">
            <div className="row">
                {/* 1st Area: Question Input */}
                <div className="col-md-6 mb-3">
                    <h3>Ask a Question</h3>
                    <textarea className="form-control" value={question} 
                        onChange={(e) => setQuestion(e.target.value)} rows="5" placeholder="Type your question here..."></textarea>
                    <button className="btn btn-primary mt-2" onClick={handleAskAI}>Ask Gemini & Save</button>
                </div>

                {/* 2nd Area: AI Answer */}
                <div className="col-md-6 mb-3">
                    <h3>AI Response</h3>
                    <div className="p-3 border rounded bg-light" style={{ minHeight: "125px", whiteSpace: "pre-wrap" }}>
                        {aiResponse || "AI answer will appear here..."}
                    </div>
                </div>
            </div>

            <hr />

            {/* 3rd Area: History from Database */}
            <div className="mt-4">
            <div>
                <h3>Saved History (from Firebase)</h3>
                
               {/* This div uses d-flex to keep buttons in one horizontal line */}
            <div className="d-flex align-items-center gap-2 mb-3">
        
                            {/* Button 1: Refresh */}
                    <button className="btn btn-secondary" onClick={fetchHistory}>
                        Refresh History
                    </button>
                    
                    {/* Button 2: The Clear History Dropdown */}
                    <div className="dropdown">
                        <button className="btn btn-danger dropdown-toggle" type="button" id="deleteDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            Clear History
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="deleteDropdown">
                            <li><button className="dropdown-item" onClick={() => deleteHistory('1h')}>Last 1 Hour</button></li>
                            <li><button className="dropdown-item" onClick={() => deleteHistory('1d')}>Last 24 Hours</button></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><button className="dropdown-item text-danger" onClick={() => deleteHistory('all')}>All History</button></li>
                        </ul>
                    </div>
        
    </div> {/* End of Horizontal Row */}


                //
                <div className="list-group">
                    {history.map((item, index) => (
                        <div key={index} className="list-group-item list-group-item-action">
                            <strong>Q:</strong> {item.question} <br />
                            <strong>A:</strong> {item.answer}
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </div>
    );
}

