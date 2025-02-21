import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'
import {useState} from "react";
import {useNavigate} from "react-router-dom";
const CreatePost = () => {
    const [title, setTile] = useState('')
    const [summary, setSummary] = useState('')
    const [content, setContent] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [redirect, setRedirect] = useState(false)
    const navigate = useNavigate();
    const handleCreatePost = async (e : React.MouseEvent<HTMLButtonElement>) => {
        const formData : FormData = new FormData();
        formData.append('title', title);
        formData.append('summary', summary);
        if (file) formData.append('file', file[0]);
        formData.append('content', content);
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/createpost', {
                method : 'POST',
                body : formData,
                credentials : 'include'
            })
            const data = await response.json()
            if (response.ok) {
                console.log("Post Created: \n", data);
                setRedirect(true)
            } else {}
            console.log("Failed to create post");
        } catch (e) {
            console.error("Unable to upload Post : ", e);
        }
    }

    if (redirect) {
        return navigate('/')
    }
    return (
        <form>
            <input type="title" placeholder={'Title'} value={title} onChange={e => setTile(e.target.value)}/>
            <input type="summary" placeholder={'Summary'} value={summary} onChange={e => setSummary(e.target.value)}/>
            <input
                type="file"
                onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                        setFile(selectedFile);
                        console.log('Selected file:', selectedFile); // Debug log
                    }
                }}
            />
            <ReactQuill value={content} onChange={e => setContent(e)}/>
            <button onClick={handleCreatePost}>Create Post</button>
        </form>
    );
}

export default CreatePost;
