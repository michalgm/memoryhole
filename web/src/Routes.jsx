import { PrivateSet, Route, Router, Set } from '@redwoodjs/router'

import BlogLayout from 'src/layouts/BlogLayout'
import ScaffoldLayout from 'src/layouts/ScaffoldLayout'

import { useAuth } from './auth'
import AdminLayout from './layouts/AdminLayout/AdminLayout'
import DocumentationPage from './pages/Documentation/DocumentationPage'

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
      <Route path="/login" page={LoginPage} name="login" />
      <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
      <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
      <PrivateSet unauthenticated="login">
        <Set wrap={BlogLayout}>
          <PrivateSet unauthenticated="login" roles="Admin">
            <Set wrap={AdminLayout}>
              <Route path="/admin" page={AdminPage} name="admin" />
            </Set>
            <Route path="/admin/editOptions" page={EditOptionsPage} name="editOptions" />
            <Route path="/admin/editOptions/{id:Int}" page={EditOptionsPage} name="editOptionSet" />
            <Route path="/admin/editOptions/new" page={EditOptionsPage} name="createOptionSet" />
            {/* <Route path="/admin/users/{id:Int}" page={UserPage} name="user" /> */}
            <Set wrap={ScaffoldLayout} title="TableViews" titleTo="tableViews" buttonLabel="New TableView" buttonTo="newTableView">
              <Route path="/table-views/new" page={TableViewNewTableViewPage} name="newTableView" />
              <Route path="/table-views/{id:Int}/edit" page={TableViewEditTableViewPage} name="editTableView" />
              <Route path="/table-views/{id:Int}" page={TableViewTableViewPage} name="tableView" />
              <Route path="/table-views" page={TableViewTableViewsPage} name="tableViews" />
            </Set>
            <Set wrap={AdminLayout} title="Users" titleTo="users" buttonLabel="New User" buttonTo="newUser">
              <Route path="/admin/users/new" page={UserUserPage} name="newUser" />
              <Route path="/admin/users/{id:Int}" page={UserUserPage} name="user" />
              <Route path="/admin/users" page={UserUsersPage} name="users" />
            </Set>
            <Set wrap={ScaffoldLayout} title="CustomSchemata" titleTo="customSchemata" buttonLabel="New CustomSchema" buttonTo="newCustomSchema">
              <Route path="/admin/custom-schemata/new" page={CustomSchemaNewCustomSchemaPage} name="newCustomSchema" />
              <Route path="/admin/custom-schemata/{id:Int}/edit" page={CustomSchemaEditCustomSchemaPage} name="editCustomSchema" />
              <Route path="/admin/custom-schemata/{id:Int}" page={CustomSchemaCustomSchemaPage} name="customSchema" />
              <Route path="/admin/custom-schemata" page={CustomSchemaCustomSchemataPage} name="customSchemata" />
            </Set>
            <Set wrap={ScaffoldLayout} title="Logs" titleTo="logs" buttonLabel="New Log" buttonTo="newLog">
              <Route path="/admin/logs/new" page={LogNewLogPage} name="newLog" />
              <Route path="/admin/logs/{id:Int}/edit" page={LogEditLogPage} name="editLog" />
              <Route path="/admin/logs/{id:Int}" page={LogLogPage} name="log" />
              <Route path="/admin/logs" page={LogLogsPage} name="logs" />
            </Set>
            <Set wrap={AdminLayout} title="Actions" titleTo="actions" buttonLabel="New Action" buttonTo="newAction">
              <Route path="/admin/actions/new" page={ActionActionPage} name="newAction" />
              <Route path="/admin/actions/{id:Int}" page={ActionActionPage} name="action" />
              <Route path="/admin/actions" page={ActionActionsPage} name="actions" />
            </Set>
          </PrivateSet>
          <Route path="/arrests/new" page={ArresteeArrestPage} name="newArresteeArrest" />
          <Route path="/arrests/{id:Int}" page={ArresteeArrestPage} name="arrest" />
          <Route path="/hotline-logs" page={HotlineLogsPage} name="hotlineLogs" />
          <Route path="/docket-sheets" page={DocketSheetsPage} name="docketSheets" />
          <Route path="/arrests" page={HomePage} name="arrests" />
          <Route path="/docs" page={DocumentationPage} name="docsHome" />
          <Route path="/docs/{page:String?home}" page={DocumentationPage} name="docs" />
          <Route path="/" page={HomePage} name="home" />
        </Set>
      </PrivateSet>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
