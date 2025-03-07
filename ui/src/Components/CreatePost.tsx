import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import '../css/CreatePost.css'
import React from 'react'; // Add this import

const CreatePost: React.FC = () => {  // Add proper type annotation
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [redirect, setRedirect] = useState(false);
    const navigate = useNavigate();

    const handleCreatePost= async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('title', title);
        formData.append('summary', summary);
        formData.append('content', content);
        if (file) {
            formData.append('file', file);
        }

        try {
            const response = await fetch('http://localhost:3000/createpost', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Post Created:", data);
                setRedirect(true);
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData);
            }
        } catch (error) {
            console.error("Unable to upload Post:", error);
        }
    }

    if (redirect) {
        navigate('/');
        return null;
    }

    return (
        <div className="create-post-container">
            <div className="create-post">
                <h2>Create a New Post</h2>
                <form className="form">
                    <input
                        className="input"
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <input
                        className="input"

                        type="text"
                        placeholder="Summary"
                        value={summary}
                        onChange={e => setSummary(e.target.value)}
                    />
                    <input
                        className="input"
                        type="file"
                        onChange={(e) => {
                            const selectedFile = e.target.files?.[0];
                            if (selectedFile) {
                                setFile(selectedFile);
                            }
                        }}
                    />
                    <div>
                        <ReactQuill
                            value={content}
                            onChange={setContent}
                            theme="snow"
                        />
                    </div>
                    <button className="createPost-button" onClick={handleCreatePost}>Create Post</button>
                </form>
            </div>
        </div>
    );
}

export default CreatePost;
