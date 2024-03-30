import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";

const ProtectedRoute = () => {
    const [message, setMessage] = useState()
    const navigate = useNavigate()

    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get('https://chop-recipes-back-end.vercel.app/verify', { withCredentials: true })
        .then(res => {
            if(res.data.valid){
                setMessage(res.data.message)
            } else{
                navigate('/')
            }
        })
        .catch(err => console.log(err))
      })
};


export default ProtectedRoute;