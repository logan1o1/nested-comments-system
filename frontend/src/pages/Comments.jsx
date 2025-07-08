import React, { useEffect, useState } from "react"
import CommentTree from "../components/CommentTree"
import "../index.css"

export default function Comments() {
  const [tree, setTree] = useState([])
  const [text, setText] = useState("")

  const load = async () => {
    const res = await fetch("http://localhost:3500/comments/get", { credentials: "include" })
    setTree(await res.json())
  }

  const postComment = async (text, parentId = null) => {
    if (!text.trim()) return
    await fetch("http://localhost:3500/comments/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        userid: localStorage.getItem("token"),
        text,
        parentId,
      }),
    })
    load()
  }

  const updateComment = async (id, newText) => {
    await fetch(`http://localhost:3500/comments/update/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ text: newText }),
    })
    load()
  }

  const deleteComment = async (id) => {
    if (!window.confirm("Delete this comment?")) return
    await fetch(`http://localhost:3500/comments/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
    load()
  }

  useEffect(() => { load() }, [])

  return (
    <div className="comments-container">
      <h2>Discussion</h2>

      <div className="new-comment">
        <textarea
          placeholder="What are your thoughts?"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button onClick={() => { postComment(text); setText("") }}>Post Comment</button>
      </div>

      {tree.map(node => (
        <CommentTree
          key={node.id}
          node={node}
          postComment={postComment}
          updateComment={updateComment}
          deleteComment={deleteComment}
        />
      ))}
    </div>
  )
}
