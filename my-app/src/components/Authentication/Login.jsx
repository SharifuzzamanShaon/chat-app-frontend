import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const [loginInfo, setLoginInfo] = useState({ email: "aaa@gmail.com", password: "aaa" });
  const [show, setShow] = useState(false);
  const [isLoading, setLoading] = useState(false)
  const toast = useToast();
  const navigate = useNavigate()
  const handleClick = () => {
    setShow(!show)
  }
  const handleChange = (e) => {
    setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value })

  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    if (!loginInfo.email || !loginInfo.password) {
      toast({
        title: 'Enter your email and password',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
      setLoading(false)
    }
    else {
      try {
        const config = {
          headers: {
            "Content-type": "application/json"
          }
        }
        const user = await axios.post("/api/auth/login",
          {
            email: loginInfo.email,
            password: loginInfo.password
          },
          config)
        if (user.status === 200 && user.statusText === 'OK') {
          localStorage.setItem("token", user.data.token );
          navigate("/chats");
        }
        else {
          toast({
            title: 'Login failed',
            status: 'error',
            description: error,
            duration: 4000,
            isClosable: true,
            position: "bottom"
          })
          setLoading(false);
          return
        }
      } catch (error) {
        toast({
          title: `${error}`,
          status: 'error',
          duration: 4000,
          isClosable: true,
          position: "bottom"
        })
        setLoading(false);
      }
    }
  }
  return (
    <VStack>
      <FormControl>
        <form onSubmit={handleSubmit}>
          <FormLabel>Email</FormLabel>
          <Input type='text' name='email' value={loginInfo.email} onChange={handleChange}></Input>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input type={show ? 'password' : 'text'} name='password' value={loginInfo.password} onChange={handleChange}></Input>
            <InputRightElement width='4.5rem'>
              <Button h='1.75rem' size='sm' onClick={handleClick}>
                {show ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
          <Button type='submit' isLoading={isLoading} mt='2'>Login</Button>
        </form>
      </FormControl>
    </VStack>
  )
}

export default Login