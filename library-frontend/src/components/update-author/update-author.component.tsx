import { useApolloClient, useMutation } from "@apollo/client/react"
import type { CSSProperties, SubmitEvent } from "react"
import { mutEditAuthor } from "../../services/apollo.service"
import type { AuthorData } from "../authors/authors.component"

type FormFields = { name: HTMLInputElement, born: HTMLInputElement }
type UpdateAuthorProps = { authors: AuthorData[] }

export const UpdateAuthor = ({ authors }: UpdateAuthorProps) => {
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
                <select id="uacNameInput" name="name">
                    <option value=''>select name</option>
                    {(authors?.length || 0) > 0 &&
                        authors.map(a => (
                            <option key={a.id} value={a.name}>{a.name}</option>
                        ))}

                </select>
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