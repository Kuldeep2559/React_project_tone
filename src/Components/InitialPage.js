import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function InitialPage() {
    const navigate = useNavigate();

    const aiBots = [
        { name: "Gemini", description: "Google's latest AI model (active)", path: "/gemini", active: true },
        { name: "ChatGPT", description: "OpenAI's conversational model", path: "#", active: false },
        { name: "Claude", description: "Anthropic's safety-focused AI", path: "#", active: false }
    ];

    return (
        <div className="container mt-5 text-center">
            <h1 className="mb-4 display-4 fw-bold text-primary">AI Chat Bots Hub</h1>
            <div className="row justify-content-center">
                {aiBots.map((bot, index) => (
                    <div key={index} className="col-md-4 mb-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">{bot.name}</h5>
                                <p className="card-text text-muted">{bot.description}</p>
                                <button 
                                    className={`btn ${bot.active ? 'btn-primary' : 'btn-outline-secondary disabled'}`}
                                    onClick={() => bot.active && navigate(bot.path)}
                                >
                                    {bot.active ? "Browse" : "Coming Soon"}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}