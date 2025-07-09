/** @format */

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import "./App.css"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import Comments from "./pages/Comments"
import Layout from "./components/Layout"
import Notifications from "./pages/Notifications"

function App() {
	const token = localStorage.getItem("token")

	return (
		<>
			<BrowserRouter>
				<Layout>
					<Routes>
						<Route
							path='/'
							element={<Navigate to={token ? "/comments" : "/signin"} />}
						/>
						<Route
							path='/signup'
							element={<SignUp />}
						/>
						<Route
							path='/signin'
							element={<SignIn />}
						/>
						<Route
							path='/comments'
							element={token ? <Comments /> : <Navigate to='/signin' />}
						/>
						<Route
							path='/notifications'
							element={token ? <Notifications /> : <Navigate to='/signin' />}
						/>
					</Routes>
				</Layout>
			</BrowserRouter>
		</>
	)
}

export default App
