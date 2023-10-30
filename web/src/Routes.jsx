import { Private, Route, Router, Set } from '@redwoodjs/router'

import BlogLayout from 'src/layouts/BlogLayout'
import ScaffoldLayout from 'src/layouts/ScaffoldLayout'
import { useAuth } from './auth'

// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Route path="/new-arrestee-arrest" page={NewArresteeArrestPage} name="newArresteeArrest" />
      <Set wrap={ScaffoldLayout} title="HotlineLogs" titleTo="hotlineLogs" buttonLabel="New HotlineLog" buttonTo="newHotlineLog">
        <Route path="/hotline-logs/new" page={HotlineLogNewHotlineLogPage} name="newHotlineLog" />
        <Route path="/hotline-logs/{id:Int}/edit" page={HotlineLogEditHotlineLogPage} name="editHotlineLog" />
        <Route path="/hotline-logs/{id:Int}" page={HotlineLogHotlineLogPage} name="hotlineLog" />
        <Route path="/hotline-logs" page={HotlineLogHotlineLogsPage} name="hotlineLogs" />
      </Set>
      <Set wrap={ScaffoldLayout} title="Users" titleTo="users" buttonLabel="New User" buttonTo="newUser">
        <Route path="/users/new" page={UserNewUserPage} name="newUser" />
        <Route path="/users/{id:Int}/edit" page={UserEditUserPage} name="editUser" />
        <Route path="/users/{id:Int}" page={UserUserPage} name="user" />
        <Route path="/users" page={UserUsersPage} name="users" />
      </Set>
      <Set wrap={ScaffoldLayout} title="Arrests" titleTo="arrests" buttonLabel="New Arrest" buttonTo="newArrest">
        <Route path="/arrests/new" page={ArrestNewArrestPage} name="newArrest" />
        <Route path="/arrests/{id:Int}/edit" page={ArrestEditArrestPage} name="editArrest" />
        <Route path="/arrests/{id:Int}" page={ArrestArrestPage} name="arrest" />
        <Route path="/arrests" page={ArrestArrestsPage} name="arrests" />
      </Set>
      <Set wrap={ScaffoldLayout} title="CustomSchemata" titleTo="customSchemata" buttonLabel="New CustomSchema" buttonTo="newCustomSchema">
        <Route path="/custom-schemata/new" page={CustomSchemaNewCustomSchemaPage} name="newCustomSchema" />
        <Route path="/custom-schemata/{id:Int}/edit" page={CustomSchemaEditCustomSchemaPage} name="editCustomSchema" />
        <Route path="/custom-schemata/{id:Int}" page={CustomSchemaCustomSchemaPage} name="customSchema" />
        <Route path="/custom-schemata" page={CustomSchemaCustomSchemataPage} name="customSchemata" />
      </Set>
      <Set wrap={ScaffoldLayout} title="Logs" titleTo="logs" buttonLabel="New Log" buttonTo="newLog">
        <Route path="/logs/new" page={LogNewLogPage} name="newLog" />
        <Route path="/logs/{id:Int}/edit" page={LogEditLogPage} name="editLog" />
        <Route path="/logs/{id:Int}" page={LogLogPage} name="log" />
        <Route path="/logs" page={LogLogsPage} name="logs" />
      </Set>
      <Set wrap={ScaffoldLayout} title="Arrestees" titleTo="arrestees" buttonLabel="New Arrestee" buttonTo="newArrestee">
        <Route path="/arrestees/new" page={ArresteeNewArresteePage} name="newArrestee" />
        <Route path="/arrestees/{id:Int}/edit" page={ArresteeEditArresteePage} name="editArrestee" />
        <Route path="/arrestees/{id:Int}" page={ArresteeArresteePage} name="arrestee" />
        <Route path="/arrestees" page={ArresteeArresteesPage} name="arrestees" />
      </Set>
      <Route path="/admin" page={AdminPage} name="admin" />
      <Route path="/login" page={LoginPage} name="login" />
      <Route path="/signup" page={SignupPage} name="signup" />
      <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
      <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
      <Private unauthenticated="login">
        <Set wrap={ScaffoldLayout} title="Arrests" titleTo="arrests" buttonLabel="New Arrest" buttonTo="newArrest">
          <Route path="/admin/arrests/new" page={ArrestNewArrestPage} name="newArrest" />
          <Route path="/admin/arrests/{id:Int}/edit" page={ArrestEditArrestPage} name="editArrest" />
          <Route path="/admin/arrests/{id:Int}" page={ArrestArrestPage} name="arrest" />
          <Route path="/admin/arrests" page={ArrestArrestsPage} name="arrests" />
        </Set>
        <Set wrap={ScaffoldLayout} title="Users" titleTo="users" buttonLabel="New User" buttonTo="newUser">
          <Route path="/admin/users/new" page={UserNewUserPage} name="newUser" />
          <Route path="/admin/users/{id:Int}/edit" page={UserEditUserPage} name="editUser" />
          <Route path="/admin/users/{id:Int}" page={UserUserPage} name="user" />
          <Route path="/admin/users" page={UserUsersPage} name="users" />
        </Set>
        <Set wrap={ScaffoldLayout} title="Arrestees" titleTo="arrestees" buttonLabel="New Arrestee" buttonTo="newArrestee">
          <Route path="/admin/arrestees/new" page={ArresteeNewArresteePage} name="newArrestee" />
          <Route path="/admin/arrestees/{id:Int}/edit" page={ArresteeEditArresteePage} name="editArrestee" />
          <Route path="/admin/arrestees/{id:Int}" page={ArresteeArresteePage} name="arrestee" />
          <Route path="/admin/arrestees" page={ArresteeArresteesPage} name="arrestees" />
        </Set>
        <Set wrap={BlogLayout}>
          <Route path="/arrestee-arrest/new" page={NewArresteeArrestPage} name="arresteeArrest" />
          <Route path="/arrestee-arrest/{id:Int}" page={ArresteeArrestPage} name="arresteeArrest" />
          <Route path="/about" page={AboutPage} name="about" />
          <Route path="/" page={HomePage} name="home" />
        </Set>
      </Private>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
