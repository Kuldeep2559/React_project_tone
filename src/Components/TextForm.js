import React, { useState } from 'react';
import { db } from './firebase'; 
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore"; 
import { GoogleGenerativeAI } from "@google/generative-ai";



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
                <h3>Saved History (from Firebase)</h3>
                <button className="btn btn-secondary mb-3" onClick={fetchHistory}>Refresh History</button>
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
    );
}




//Commented
// export default function TextForm() {
//     const [text, setText] = useState("");
//     const [history, setHistory] = useState(""); // State to store all pulled data

//     // 1. Function to SAVE data (Each click creates a NEW entry)
//     const handleOnSubmit = async () => {
//         if (text.trim() === "") return;
//         try {
//             await addDoc(collection(db, "user_entries"), {
//                 content: text,
//                 timestamp: new Date()
//             });
//             setText(""); // Clear the top box after saving
//             alert("Saved to Database!");
//         } catch (e) {
//             console.error("Error: ", e);
//         }
//     };

//     // 2. Function to DISPLAY all data
//     const handleDisplay = async () => {
//         try {
//             // We ask Firebase for the "user_entries" folder, sorted by time
//             const q = query(collection(db, "user_entries"), orderBy("timestamp", "desc"));
//             const querySnapshot = await getDocs(q);
            
//             // We combine all the text pieces into one big string
//             let allText = "";
//             querySnapshot.forEach((doc) => {
//                 allText += `${doc.data().content}\n---\n`; 
//             });
            
//             setHistory(allText); // Put the big string into our second box
//         } catch (e) {
//             console.error("Error fetching: ", e);
//         }
//     };

//     return (
//         <div className="container mt-4">
//             <h3>Input Area</h3>
//             <textarea className="form-control" value={text} onChange={(e) => setText(e.target.value)} rows="4"></textarea>
            
//             <div className="mt-2">
//                 <button className="btn btn-success me-2" onClick={handleOnSubmit}>Save to Firebase</button>
//                 <button className="btn btn-info" onClick={handleDisplay}>Display All History</button>
//             </div>

//             <hr />

//             <h3>Database History</h3>
//             <textarea 
//                 className="form-control bg-light" 
//                 value={history} 
//                 readOnly // This makes it so you can't type in the history box
//                 placeholder="Click 'Display' to see old data..."
//                 rows="8"
//             ></textarea>
//         </div>
//     );
// }