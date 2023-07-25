import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const INITIAL_FORM_VALUES = { name: "", email: "", password: "", confirmPassword: "", picture: "" }

const Signup = () => {

  const [regInfo, setInfo] = useState({ ...INITIAL_FORM_VALUES });
  const [show, setShow] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const uploadImage = (pic) => {
    setLoading(true);
    if (pic === undefined) {
      toast({
        title: 'Please Select an Image',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      setLoading(false);
      return
    }
    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic)
      data.append("upload_preset", "chat-app")
      data.append("cloud_name", "daaxwtbba")
      fetch("https://api.cloudinary.com/v1_1/daaxwtbba/image/upload", {
        method: "post",
        body: data
      }).then((res) => res.json())
        .then(data => {
          setInfo({ ...regInfo, picture: data.url.toString() });
          setLoading(false)
        })
        .catch((error) => {
          setLoading(false);
        });
    } else {
      toast({
        title: 'Please Select an jpg/png Image',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      setLoading(false)
    }
  }
  const handleClick = () => {
    setShow(!show);
  }


  const handleChange = (e) => {
    setInfo({ ...regInfo, [e.target.name]: e.target.value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!regInfo.name || !regInfo.email || !regInfo.password || !regInfo.picture) {
      toast({
        title: 'Please fillup all the data field',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })

      setLoading(false)
      return
    }
    else if (regInfo.password !== regInfo.confirmPassword) {
      toast({
        title: "Password didn't match",
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      setLoading(false)
      return
    } else {
      try {
        const config = {
          headers: {
            'Content-type': 'application/json'
          },
        };
        const data = await axios.post("/api/auth/reg", {
          name: regInfo.name,
          email: regInfo.email,
          password: regInfo.password,
          picture: regInfo.picture
        }, config)
        toast({
          title: 'Successfully registered',
          status: 'success',
          duration: 4000,
          isClosable: true,
          position: "bottom"
        })
        localStorage.setItem("userInfo", JSON.stringify(data.token))
        setLoading(false);
        navigate('/chats');

        return;
      }
      catch (error) {
        toast({
          title: 'Failed to register',
          status: 'success',
          description: error.res,
          duration: 4000,
          isClosable: true,
          position: "bottom"
        })
        setLoading(false)

      }

    }

    setInfo({ ...INITIAL_FORM_VALUES })

  }


  return (
    <VStack>
      <FormControl>
        <form onSubmit={handleSubmit}>
          <FormLabel>Name</FormLabel>
          <Input type='text' name='name' value={regInfo.name} onChange={handleChange}></Input>
          <FormLabel>Email</FormLabel>
          <Input type='email' name='email' value={regInfo.email} onChange={handleChange}></Input>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input type={show ? 'text' : 'password'} name='password' value={regInfo.password} onChange={handleChange}></Input>
            <InputRightElement width='4.5rem'>
              <Button h='1.75rem' size='sm' onClick={handleClick}>
                {show ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>

          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input type={show ? 'text' : 'password'} name='confirmPassword' value={regInfo.confirmPassword} onChange={handleChange}></Input>
            <InputRightElement width='4.5rem'>
            </InputRightElement>
          </InputGroup>
          <FormLabel>Upload Your Picture</FormLabel>
          <Input type='file' name='picture' accept="image/*" onChange={(e) => uploadImage(e.target.files[0])}></Input>
          <Button isLoading={isLoading} colorScheme='teal' variant='solid' type='Submit' mt='2'>Submit</Button>
        </form>
      </FormControl>
    </VStack>
  )
}

export default Signup