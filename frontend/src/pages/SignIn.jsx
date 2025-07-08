/** @format */

import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

export default function SignIn() {
	const [form, setForm] = useState({ username: "", password: "" })
	const nav = useNavigate()

	const submit = async (e) => {
		e.preventDefault()
		const res = await fetch("http://localhost:3500/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify(form),
		})
		if (res.ok) {
			const user = await res.json()
			localStorage.setItem("token", user.id) // simple flag
			nav("/comments")
		} else {
			alert("Login failed")
		}
	}

	return (
		<form className="form-container" onSubmit={submit}>
			<h2>Sign In</h2>
			<input
				placeholder='Username'
				onChange={(e) => setForm({ ...form, username: e.target.value })}
			/>
			<input
				type='password'
				placeholder='Password'
				onChange={(e) => setForm({ ...form, password: e.target.value })}
			/>
			<button type='submit'>Sign In</button>
			<p style={{ textAlign: 'center' }}>
				New? <Link to='/signup'>Sign Up</Link>
			</p>
		</form>
	)
}
