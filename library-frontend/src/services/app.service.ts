import { clientApollo, mulLogin, queryMe } from "./apollo.service"
import * as zu from 'zustand'

type TPage = 'authors' | 'books' | 'add' | 'login' | 'logout' | 'recommend'

export interface IAppStore {
    token?: string
    page: TPage
    selectedGenre: string|undefined


    setToken: (x: string|undefined) => void
    setPage: (x: TPage) => void
}

const tokenKey = 'tokeyKey'
const getDefaultToken = () => localStorage.getItem(tokenKey) as string

export const useAppStore = zu.create<IAppStore>()((set) => {

    return {
        selectedGenre: '',
        page: 'authors',
        token: getDefaultToken(),

        setToken: (token: string) => {
            set(() => {
                return { token }
            })
        },
        setPage: (page: TPage) => {
            set(() => {
                return { page }
            })
        }
    }
})

export const setLogin = (token: string|undefined) => {
    
    !token? localStorage.removeItem(tokenKey):localStorage.setItem(tokenKey, token)
    useAppStore.getState().setToken(token)
}

type TLogin = { username: string, password: string }
export const login = async (args: TLogin) => {

    const result = await clientApollo.mutate({
        mutation: mulLogin,
        variables: args
    })
    

    const token = result.data?.login?.value as string
    await clientApollo.clearStore()
    setLogin(token)
    return true

}
