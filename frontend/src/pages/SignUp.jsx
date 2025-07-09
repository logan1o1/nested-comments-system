/** @format */

import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

export default function SignUp() {
	const [form, setForm] = useState({ username: "", email: "", password: "" })
	const nav = useNavigate()

	const submit = async (e) => {
		e.preventDefault()
		const res = await fetch("http://localhost:3500/auth/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include", // so cookie gets set
			body: JSON.stringify(form),
		})
		if (res.ok) nav("/signin")
		else alert("Signup failed")
	}

	return (
		<form
			className='form-container'
			onSubmit={submit}>
			<h2>Sign Up</h2>
			<input
				placeholder='Username'
				onChange={(e) => setForm({ ...form, username: e.target.value })}
			/>
			<input
				placeholder='Email'
				onChange={(e) => setForm({ ...form, email: e.target.value })}
			/>
			<input
				type='password'
				placeholder='Password'
				onChange={(e) => setForm({ ...form, password: e.target.value })}
			/>
			<button type='submit'>Sign Up</button>
			<p style={{ textAlign: 'center' }}>
				Already have an account? <Link to='/signin'>Sign In</Link>
			</p>
		</form>
	)
}
