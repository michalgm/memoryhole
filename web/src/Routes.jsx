import { PrivateSet, Route, Router, Set } from '@redwoodjs/router'

import MainLayout from 'src/layouts/MainLayout/MainLayout'
import ModelLayout from 'src/layouts/ModelLayout/ModelLayout'
import ScaffoldLayout from 'src/layouts/ScaffoldLayout/ScaffoldLayout'
import * as _fragments from 'src/lib/gql_fragments'

import { useAuth } from './auth'
// import DocumentationPage from './pages/Documentation/DocumentationPage'

// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/ArrestsPage/ArrestsPage.js'         -> ArrestsPage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Route path="/login" redirect="/sign-in" />
      <Set>
        <Route path="/sign-in" page={LoginPage} name="login" />
        <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
        <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
      </Set>
      <PrivateSet unauthenticated="login">
        <Set wrap={MainLayout}>
          <Set wrap={ModelLayout} title="User Profile">
            <Route path="/userProfile" page={UserProfilePage} name="userProfile" />
          </Set>
          <PrivateSet unauthenticated="login" roles={['Admin', 'Coordinator']}>
            <Set wrap={ModelLayout}>
              <Route path="/admin" page={AdminPage} name="admin" />
              <Route path="/admin/settings" page={SettingsPage} name="settings" />
            </Set>
            <Set wrap={ModelLayout} title="Docket Sheets" titleTo="docketSheets">
              <Route path="/admin/docket-sheets" page={DocketSheetsPage} name="docketSheets" />
            </Set>
            <Route path="/admin/editOptions" page={EditOptionsPage} name="editOptions" />
            <Route path="/admin/editOptions/{id:Int}" page={EditOptionsPage} name="editOptionSet" />
            <Route path="/admin/editOptions/new" page={EditOptionsPage} name="createOptionSet" />
            <Set wrap={ModelLayout} title="Edit Site Help">
              <Route path="/admin/edit-help" page={EditHelpPage} name="editHelp" />
            </Set>
            <Set wrap={ModelLayout} title="Users" titleTo="users" buttonTo="newUser">
              <Route path="/admin/users/new" page={UserUserPage} name="newUser" />
              <Route path="/admin/users/{id:Int}" page={UserUserPage} name="user" />
              <Route path="/admin/users" page={UserUsersPage} name="users" />
            </Set>
            <Set wrap={ModelLayout} title="Actions" titleTo="actions" buttonTo="newAction">
              <Route path="/admin/actions/new" page={ActionActionPage} name="newAdminAction" />
              <Route path="/admin/actions/{id:Int}" page={ActionActionPage} name="AdminAction" />
              <Route path="/admin/actions" page={ActionActionsPage} name="AdminActions" />
            </Set>
            <Set>
              <Set wrap={ScaffoldLayout} title="TableViews" titleTo="tableViews" buttonTo="newTableView">
                <Route path="/table-views/new" page={TableViewNewTableViewPage} name="newTableView" />
                <Route path="/table-views/{id:Int}/edit" page={TableViewEditTableViewPage} name="editTableView" />
                <Route path="/table-views/{id:Int}" page={TableViewTableViewPage} name="tableView" />
                <Route path="/table-views" page={TableViewTableViewsPage} name="tableViews" />
              </Set>
              <Set wrap={ScaffoldLayout} title="CustomSchemata" titleTo="customSchemata" buttonTo="newCustomSchema">
                <Route path="/admin/custom-schemata/new" page={CustomSchemaNewCustomSchemaPage} name="newCustomSchema" />
                <Route path="/admin/custom-schemata/{id:Int}/edit" page={CustomSchemaEditCustomSchemaPage} name="editCustomSchema" />
                <Route path="/admin/custom-schemata/{id:Int}" page={CustomSchemaCustomSchemaPage} name="customSchema" />
                <Route path="/admin/custom-schemata" page={CustomSchemaCustomSchemataPage} name="customSchemata" />
              </Set>
            </Set>
          </PrivateSet>
          <Set wrap={ModelLayout} title="Arrests" titleTo="arrests" buttonTo="newArrest">
            <Route path="/arrests/new" page={ArrestArrestPage} name="newArrest" />
            <Route path="/arrests/{id:Int}" page={ArrestArrestPage} name="arrest" />
            <Route path="/arrests" page={ArrestArrestsPage} name="arrests" />
            <Route path="/" redirect="arrests" name="home" />
            <Route path="/arrests/{id:Int}/compare/{compareId:Int}" page={ArrestCompareArrestPage} name="compareArrest" />
            <Route path="/arrests/duplicates" page={ArrestArrestDuplicatesPage} name="findDuplicateArrests" />
            <Route path="/arrests/duplicates/{id:Int}/compare/{compareId:Int}" page={ArrestCompareArrestPage} name="findDuplicateArrestsCompare" />
          </Set>
          <Set wrap={ModelLayout} title="Actions" titleTo="actions" buttonTo="newAction">
            <Route path="/actions" page={ActionActionsPage} name="actions" />
            <Route path="/actions/new" page={ActionActionPage} name="newAction" />
            <Route path="/actions/{id:Int}" page={ActionActionPage} name="action" />
          </Set>
          <Set wrap={ModelLayout} title="Logs" titleTo="logs" buttonTo="logs" buttonParams={{ new: true }} buttonLabel="New Log">
            <Route path="/logs" page={LogLogsPage} name="logs" />
          </Set>
          <Route path="/docs" page={DocumentationPage} name="docsHome" />
          <Route path="/docs/{page:String}" page={DocumentationPage} name="docs" />
        </Set>
      </PrivateSet>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
