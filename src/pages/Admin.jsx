import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { firestore } from "../firebase";
import { Editor } from "@tinymce/tinymce-react";
import { addDoc, collection, getDocs } from "@firebase/firestore";
import Items from "./Items";
import Spinner from "./Spinner";
import UpperFooter from "./UpperFooter";

export default function Admin() {
  const [isLoading, setIsLoading] = useState(false);
  const contentRef = useRef();
  const messageRef = useRef();
  const urlRef = useRef();
  const editorRef = useRef(null);

  const messagesRef = collection(firestore, "bloging");

  const [blogPosts, setBlogPosts] = useState([]);
  const inputStyle = {
    width: 200,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
    border: "none",
    borderRadius: 3,
    paddingTop: 5,
    paddingBottom: 5,
  };

  async function fetchBlogPosts() {
    setIsLoading(true);
    const querySnapshot = await getDocs(collection(firestore, "bloging"));
    const posts = querySnapshot.docs.map((doc) => doc.data());
    setBlogPosts(posts);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchBlogPosts();
  }, []);
  const submithandler = async (e) => {
    e.preventDefault();
    let data = {
      title: contentRef.current.value,
      message: messageRef.current.value,
      url: urlRef.current.value,
      txt: editorRef.current.getContent(),
    };

    if (
      data.title.trim().length > 3 &&
      data.message.trim().length > 5 &&
      data.url &&
      data.txt.length > 20
    ) {
      toast("Data Submitted", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      try {
        await addDoc(messagesRef, data);
        contentRef.current.value = "";
        messageRef.current.value = "";
        urlRef.current.value = "";
        editorRef.current.setContent("");
        fetchBlogPosts();
        setIsLoading(false);
      } catch (e) {
        console.log(e);
      }
    } else {
    }
  };
  return (
    <div className=" z-1">
      <h1 className="text-center py-3">Blog Posts Website</h1>
      <form
        className="text-center border border-1 rounded py-5 z-3"
        style={{
          marginLeft: 400,
          marginRight: 400,
          backgroundColor: "rgba(250, 250, 250, 0.116)",
        }}
        onSubmit={submithandler}
      >
        <label>Enter Image Url: &emsp; &nbsp;</label>
        <input
          type="text"
          ref={urlRef}
          name="url"
          placeholder="Write Url"
          required
          style={inputStyle}
        />
        <br />
        <label>Enter Title: &emsp; &emsp; &emsp; &nbsp;</label>
        <input
          type="text"
          ref={contentRef}
          name="title"
          placeholder="Title"
          required
          style={inputStyle}
        />
        <br />
        <label>Enter Description: &emsp;</label>
        <input
          type="text"
          ref={messageRef}
          name="description"
          placeholder="description"
          required
          style={inputStyle}
          className="mb-4"
        />
        <br />
        <Editor
          apiKey="0ww6aa6ikkaan6ba6quxckauho9cnonhzczagghofh5md40x"
          onInit={(evt, editor) => (editorRef.current = editor)}
          initialValue="<p>This is the initial content of the editor.</p>"
          init={{
            height: 500,
            menubar: false,
            plugins: [
              "advlist autolink lists link image charmap print preview anchor",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime media table paste code help wordcount",
            ],
            toolbar:
              "undo redo | formatselect | " +
              "bold italic backcolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
          }}
        />
        <br />
        <button
          className="animate__animated animate__backInDown  btn btn-primary my-3 px-5 w-50"
          type="submit"
        >
          Submit
        </button>
      </form>
      {isLoading ? (
        <Spinner />
      ) : (
        <Items
          posts={blogPosts}
          style={{ marginTop: 1000, paddingTop: 1000, backgroundColor: "red" }}
        />
      )}
      <UpperFooter />
    </div>
  );
}
