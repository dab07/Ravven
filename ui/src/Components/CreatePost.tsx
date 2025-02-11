import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'
import {useState} from "react";
const CreatePost = () => {
    const [title, setTile] = useState('')
    const [summary, setSummary] = useState('')
    const [value, setValue] = useState('')
    const [file, setFile] = useState('')

    const handleCreatePost = async (e : React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/createpost', {
                method : 'POST',
                body : JSON.stringify({title, summary, file, value}),
                headers : {
                    'Content-Type' : 'application/json'
                },
            })
            const data = await response.json()
            if (response.ok) {
                console.log("Post Created: \n", data);
            } else {}
            console.log("Failed to create post");
        } catch (e) {
            console.error("Unable to upload Post : ", e);
        }
    }
    return (
        <form >
            <input type="title" placeholder={'Title'} value={title} onChange={e => setTile(e.target.value)}/>
            <input type="summary" placeholder={'Summary'} value={summary} onChange={e => setSummary(e.target.value)}/>
            <input type="file" value={file} onChange={e => setFile(e.target.value)}/>
            <ReactQuill value={value} onChange={e => setValue(e)}/>
            <button onClick={handleCreatePost}>Create Post</button>
        </form>
    );
}

export default CreatePost;
