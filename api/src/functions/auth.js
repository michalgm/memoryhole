import {
  DbAuthHandler,
  PasswordValidationError,
} from '@redwoodjs/auth-dbauth-api'

import { cookieName } from 'src/lib/auth'
import { sendReset, tokenExpireHours } from 'src/lib/authHelpers'
import { db } from 'src/lib/db'

const login_expire_hours = 6
// const login_expire_hours = 1 / 60 / 10

const validateUser = (user) => {
  if (user.expiresAt && new Date(user.expiresAt) < Date.now()) {
    return false
  }
  return user
}

export const handler = async (event, context) => {
  const forgotPasswordOptions = {
    // handler() is invoked after verifying that a user was found with the given
    // username. This is where you can send the user an email with a link to
    // reset their password. With the default dbAuth routes and field names, the
    // URL to reset the password will be:
    //
    // https://example.com/reset-password?resetToken=${user.resetToken}
    //
    // Whatever is returned from this function will be returned from
    // the `forgotPassword()` function that is destructured from `useAuth()`.
    // You could use this return value to, for example, show the email
    // address in a toast message so the user will know it worked and where
    // to look for the email.
    //
    // Note that this return value is sent to the client in *plain text*
    // so don't include anything you wouldn't want prying eyes to see. The
    // `user` here has been sanitized to only include the fields listed in
    // `allowedUserFields` so it should be safe to return as-is.
    handler: async (user, resetToken) => {
      await sendReset(user, resetToken)

      return user
    },

    // How long the resetToken is valid for, in seconds (default is 24 hours)
    expires: 60 * 60 * tokenExpireHours,

    errors: {
      // for security reasons you may want to be vague here rather than expose
      // the fact that the email address wasn't found (prevents fishing for
      // valid email addresses)
      usernameNotFound: 'User not found',
      // if the user somehow gets around client validation
      usernameRequired: 'Username is required',
    },
  }

  const loginOptions = {
    // handler() is called after finding the user that matches the
    // username/password provided at login, but before actually considering them
    // logged in. The `user` argument will be the user in the database that
    // matched the username/password.
    //
    // If you want to allow this user to log in simply return the user.
    //
    // If you want to prevent someone logging in for another reason (maybe they
    // didn't validate their email yet), throw an error and it will be returned
    // by the `logIn()` function from `useAuth()` in the form of:
    // `{ message: 'Error message' }`
    handler: (user) => {
      if (!validateUser(user)) {
        throw Error(
          'Your account has expired. Please contact an administrator to reactivate your account.'
        )
      }

      // Ensure the login attempt is from localhost
      const requestOrigin = event.headers['x-forwarded-for'] || event.clientIp
      if (
        user.name.match(/^svc-/) &&
        requestOrigin !== '127.0.0.1' &&
        requestOrigin !== '::1'
      ) {
        throw Error('Login restricted to localhost')
      }
      return user
    },

    errors: {
      usernameOrPasswordMissing: 'Both email and password are required',
      usernameNotFound: 'Login failed - check email and password',
      // For security reasons you may want to make this the same as the
      // usernameNotFound error so that a malicious user can't use the error
      // to narrow down if it's the username or password that's incorrect
      // incorrectPassword: "Incorrect password for ${username}",
      incorrectPassword: 'Login failed - check email and password',
    },

    // How long a user will remain logged in, in seconds
    expires: 60 * 60 * login_expire_hours,
  }

  const resetPasswordOptions = {
    // handler() is invoked after the password has been successfully updated in
    // the database. Returning anything truthy will automatically log the user
    // in. Return `false` otherwise, and in the Reset Password page redirect the
    // user to the login page.
    handler: (user) => {
      if (!validateUser(user)) {
        throw Error(
          'Your password has been reset successfully. However, your account has expired. Please contact an administrator to reactivate your account.'
        )
      }
      return user
    },

    // If `false` then the new password MUST be different from the current one
    allowReusedPassword: false,

    errors: {
      // the resetToken is valid, but expired
      resetTokenExpired:
        'resetToken is expired. Please begin the password reset process again.',
      // no user was found with the given resetToken
      resetTokenInvalid:
        'resetToken is invalid. Please begin the password reset process again.',
      // the resetToken was not present in the URL
      resetTokenRequired: 'resetToken is required',
      // new password is the same as the old password (apparently they did not forget it)
      reusedPassword: 'You must choose a new password',
    },
  }

  const signupOptions = {
    enabled: false,
    // Whatever you want to happen to your data on new user signup. Redwood will
    // check for duplicate usernames before calling this handler. At a minimum
    // you need to save the `username`, `hashedPassword` and `salt` to your
    // user table. `userAttributes` contains any additional object members that
    // were included in the object given to the `signUp()` function you got
    // from `useAuth()`.
    //
    // If you want the user to be immediately logged in, return the user that
    // was created.
    //
    // If this handler throws an error, it will be returned by the `signUp()`
    // function in the form of: `{ error: 'Error message' }`.
    //
    // If this returns anything else, it will be returned by the
    // `signUp()` function in the form of: `{ message: 'String here' }`.
    handler: ({ _username, _hashedPassword, _salt, _userAttributes }) => {
      return false
      // return db.user.create({
      //   data: {
      //     email: username,
      //     hashedPassword: hashedPassword,
      //     salt: salt,
      //     name: userAttributes.name,
      //     role: userAttributes.role,
      //   },
      // })
    },

    // Include any format checks for password here. Return `true` if the
    // password is valid, otherwise throw a `PasswordValidationError`.
    // Import the error along with `DbAuthHandler` from `@redwoodjs/api` above.
    passwordValidation: (_password) => {
      if (_password.length < 8) {
        throw new PasswordValidationError(
          'Password must be at least 8 characters'
        )
      }
      return true
    },

    errors: {
      // `field` will be either "username" or "password"
      fieldMissing: '${field} is required',
      usernameTaken: 'Username `${username}` already in use',
    },
  }

  const authHandler = new DbAuthHandler(event, context, {
    // Provide prisma db client
    db: db,

    // The name of the property you'd call on `db` to access your user table.
    // i.e. if your Prisma model is named `User` this value would be `user`, as in `db.user`
    authModelAccessor: 'user',
    allowedUserFields: [
      'id',
      'email',
      'name',
      'role',
      'action_ids',
      'access_date_max',
      'access_date_min',
      'access_date_threshold',
      'expiresAt',
    ],
    // A map of what dbAuth calls a field to what your database calls it.
    // `id` is whatever column you use to uniquely identify a user (probably
    // something like `id` or `userId` or even `email`)
    authFields: {
      id: 'id',
      username: 'email',
      hashedPassword: 'hashedPassword',
      salt: 'salt',
      resetToken: 'resetToken',
      resetTokenExpiresAt: 'resetTokenExpiresAt',
    },

    // Specifies attributes on the cookie that dbAuth sets in order to remember
    // who is logged in. See https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies
    cookie: {
      attributes: {
        HttpOnly: true,
        Path: '/',
        SameSite: 'Strict',
        Secure: process.env.NODE_ENV !== 'development',

        // If you need to allow other domains (besides the api side) access to
        // the dbAuth session cookie:
        // Domain: 'example.com',
      },
      name: cookieName,
    },

    forgotPassword: forgotPasswordOptions,
    login: loginOptions,
    resetPassword: resetPasswordOptions,
    signup: signupOptions,
  })

  return await authHandler.invoke()
}
