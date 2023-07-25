import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();


const ChatProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState()
    
    const navigate = useNavigate()
    useEffect(() => {
        const token = localStorage.getItem("token")
        axios.get("/access-chats", {
            headers: {
                Authorization: token
            }
        }).then((res) => {
            setUserInfo(res.data);

        }).catch((error) => {
            navigate("/")
        })
    }, [navigate])
    return (
        <ChatContext.Provider value={{ chats, setChats, selectedChat, setSelectedChat, userInfo }}>
            {children}</ChatContext.Provider>
    )

}
const useGlobalContext = () => {
    return useContext(ChatContext)
}
export { ChatProvider, useGlobalContext, ChatContext }