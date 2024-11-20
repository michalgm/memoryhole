import { useCallback, useEffect, useRef, useState } from 'react'

import { Key } from '@mui/icons-material'
import { Paper, Typography } from '@mui/material'
import { Box, Container, Stack } from '@mui/system'
import { FormContainer, TextFieldElement } from 'react-hook-form-mui'

import { navigate, routes, useLocation } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import Link from 'src/components/utils/Link'
import LoadingButton from 'src/components/utils/LoadingButton'
import { useSnackbar, useDisplayError } from 'src/components/utils/SnackBar'

export const ModalCard = ({ children, sx = {}, ...props }) => {
  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          ...sx,
        }}
      >
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Stack direction="column" alignItems={'center'}>
            <Box
              sx={{
                bgcolor: 'primary.light',
                width: '100%',
                p: 2,
                textAlign: 'center',
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  fontSize: `1.5rem`,
                  color: 'primary.contrastText',
                }}
              >
                {props.title}
              </Typography>
            </Box>

            <Box sx={{ width: '100%', p: 4 }}>
              <Stack direction="column" spacing={2} alignItems={'center'}>
                {children}
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Container>
  )
}

export const AuthManage = ({
  title,
  children,
  action,
  monitorAuth = false,
  postButtonElements = [],
  header,
  onSuccess,
}) => {
  const { isAuthenticated, logOut, getCurrentUser } = useAuth()
  const { search } = useLocation()
  const [checkedAuth, setCheckedAuth] = useState(false)
  const [loading, setLoading] = useState(false)
  const { openSnackbar } = useSnackbar()
  const displayError = useDisplayError()

  const redirect = useCallback(() => {
    const params = new URLSearchParams(search)
    let to = routes.home()
    if (params.get('redirectTo')) {
      const redirectPath = params.get('redirectTo')
      if (redirectPath.includes('noRedirect')) {
        console.log(`skipping additional redirects to ${redirectPath}`)
      } else {
        to = redirectPath
      }
    }
    params.delete('redirectTo')
    params.append('noRedirect', 'true')
    navigate(`${to}?${params.toString()}`)
  }, [search])

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home())
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (monitorAuth) {
      ;(async () => {
        if (!checkedAuth && isAuthenticated) {
          try {
            await getCurrentUser()
            redirect()
          } catch {
            logOut()
          }
          setCheckedAuth(true)
        }
      })()
    } else {
      if (isAuthenticated) {
        console.log('whoa we gettin redired')
        redirect()
      }
    }
  }, [
    isAuthenticated,
    redirect,
    getCurrentUser,
    logOut,
    checkedAuth,
    monitorAuth,
  ])

  const emailRef = useRef(null)
  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    let response
    try {
      response = await action(data)
    } catch (error) {
      response.error = error
    }
    if (response.error || response.errors) {
      displayError(response.error || response.errors)
    } else {
      try {
        onSuccess &&
          (await onSuccess({
            response,
            data,
            redirect,
            openSnackbar,
            displayError,
          }))
      } catch (error) {
        displayError(error)
      }
    }
    setLoading(false)
  }

  return (
    <>
      <Metadata title={title} />
      {header && (
        <header>
          <Typography
            sx={{
              color: 'primary.main',
              p: 5,
              mb: 2,
              textAlign: 'center',
              fontWeight: 500,
              letterSpacing: 0,
            }}
            variant="h1"
          >
            {header}
          </Typography>
        </header>
      )}
      <main>
        <FormContainer
          defaultValues={{}}
          onSuccess={onSubmit}
          autoComplete="on"
        >
          <ModalCard
            title={title}
            sx={{
              pt: header ? 0 : 5,
            }}
          >
            {children}
            <LoadingButton
              loading={loading}
              sx={{ width: '100%' }}
              type="submit"
              variant="contained"
              color="primary"
              containerProps={{ sx: { width: '100%' } }}
              startIcon={<Key />}
            >
              {title}
            </LoadingButton>
            {...postButtonElements}
          </ModalCard>
        </FormContainer>
      </main>
    </>
  )
}

const LoginPage = () => {
  const { logIn } = useAuth()

  const action = (data) =>
    logIn({
      username: data.email,
      password: data.password,
    })

  return (
    <AuthManage
      title="Sign In"
      action={action}
      onSuccess={({ redirect }) => redirect()}
      header="Welcome to the Memoryhole!"
      monitorAuth
      postButtonElements={[
        <Box
          key="forgot-password"
          sx={{ pt: 2, textAlign: 'right', width: '100%' }}
        >
          <Typography variant="body2">
            <Link to={routes.forgotPassword()}>Forgot Password?</Link>
          </Typography>
        </Box>,
      ]}
    >
      <TextFieldElement
        fullWidth
        name="email"
        label="Email"
        id="email"
        autoComplete="username"
        autoFocus // eslint-disable-line jsx-a11y/no-autofocus
        validation={{
          required: 'Email is required',
          validate: (value) =>
            !value ||
            /^[^@\s]+@[^.\s]+\.[^\s]+$/.test(value) ||
            'Email must be formatted like an email',
        }}
      />
      <TextFieldElement
        fullWidth
        sx={{ pb: 2 }}
        id="password"
        name="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        validation={{
          required: 'Password is required',
        }}
      />
    </AuthManage>
  )
}

export default LoginPage
