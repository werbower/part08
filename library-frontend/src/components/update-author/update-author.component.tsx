import { useApolloClient, useMutation } from "@apollo/client/react"
import type { CSSProperties, SubmitEvent } from "react"
import { mutEditAuthor } from "../../services/apollo.service"

type FormFields = { name: HTMLInputElement, born: HTMLInputElement }

export const UpdateAuthor = () => {
    const [updateAuthor] = useMutation(mutEditAuthor)
    const apolloClient = useApolloClient()


    const handleFormSubmit = async (event: SubmitEvent<HTMLFormElement> & { target: FormFields }) => {
        const name = event.target.name.value
        const born = +(event.target.born.value || 0)
        const result = await updateAuthor({ variables: { name, setBornTo: born } })
        if (result.data?.editAuthor)
            await apolloClient.clearStore()

    }

    const formStyle: CSSProperties = {
        display: 'flex', flexDirection: 'column'
    }

    //comp pref uac
    return (<>
        <h3>Set birthyear</h3>
        <form style={formStyle} onSubmit={handleFormSubmit}>
            <div className="row">
                <label htmlFor="uacNameInput">name</label>
                <input id="uacNameInput" name="name" />
            </div>
            <div className="row">
                <label htmlFor="uacBornInput">born</label>
                <input id="uacBornInput" type="number" name="born" />
            </div>
            <div>
                <button type="submit">update author</button>
            </div>


        </form>


    </>)
}