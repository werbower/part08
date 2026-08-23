import { useState, type SubmitEvent } from "react"
import { login, useAppStore } from "../../services/app.service"

export const Login = () => {
    const setPage = useAppStore(x=> x.setPage)
    const [errMessage, setErrMessage] = useState<string>('')

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement> &
    { target: { username: HTMLInputElement, password: HTMLInputElement } }) => {
        e.preventDefault()
        const form = e.target
        const username = form.username.value
        const password = form.password.value
        try {
            await login({ username, password })
            setPage('authors')
        } catch {
            setErrMessage('login failed')
            setTimeout(()=> setErrMessage(''), 5000)
        }
        
    }


    return (<>
        {!!errMessage && <div>{errMessage}</div>}

        <form onSubmit={handleSubmit}>
            <div className="row">
                <label htmlFor="usernameId">username</label>
                <input id="usernameId" name="username" />
            </div>
            <div className="row">
                <label htmlFor="passwordId">password</label>
                <input id="passwordId" name="password" type="password"/>
            </div>
            <div>
                <button type="submit">login</button>
            </div>
        </form>
    </>)
}