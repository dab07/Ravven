import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/CreatePost.css';

const CreatePost: React.FC = () => {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [redirect, setRedirect] = useState(false);
    const navigate = useNavigate();

    const handleCreatePost = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('title', title);
        formData.append('summary', summary);
        formData.append('content', content);
        if (file) {
            formData.append('file', file);
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/createpost`, {
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
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const fileURL = URL.createObjectURL(selectedFile);
            setImagePreview(fileURL);
        }
    };

    if (redirect) {
        navigate('/');
        return null;
    }

    return (
        <div className="create-post-container">
            <div className="create-post">
                <form className="form">
                    {/* Flexbox Container */}
                    <div className="form-top-section">
                        <div className="left-section">
                            <input
                                className="input title-input"
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                            <textarea
                                className="input summary-input"
                                placeholder="Summary"
                                value={summary}
                                onChange={e => setSummary(e.target.value)}
                            />
                        </div>

                        <div className="right-section">
                            <label htmlFor="file-upload" className="custom-file-upload">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="image-preview" />
                                ) : (
                                    "Choose an Image"
                                )}
                            </label>
                            <input
                                id="file-upload"
                                className="file-input"
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <div className="quill-container">
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
