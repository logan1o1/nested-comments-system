import React from "react"
import { useNavigate } from "react-router-dom"
import "./Layout.css"

export default function Layout({ children }) {
	const navigate = useNavigate()
	const token = localStorage.getItem("token")

	const logout = () => {
		localStorage.removeItem("token")
		navigate("/signin")
	}

	return (
		<div className='layout'>
			{token && (
				<button
					className='logout-btn'
					onClick={logout}>
					Logout
				</button>
			)}
			<div className='content'>{children}</div>
		</div>
	)
}
