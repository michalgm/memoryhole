import { PrivateSet, Route, Router, Set as RouterSet } from '@cedarjs/router'

import MainLayout from 'src/layouts/MainLayout/MainLayout'
import ModelLayout from 'src/layouts/ModelLayout/ModelLayout'

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
  const { currentUser, loading } = useAuth()
  if (loading) {
    return null
  }
  const role = currentUser?.roles?.[0]
  return (
    <Router useAuth={useAuth}>
      <Route path="/login" redirect="/sign-in" />
      <RouterSet>
        <Route path="/sign-in" page={LoginPage} name="login" />
        <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
        <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
      </RouterSet>
      <PrivateSet unauthenticated="login">
        <RouterSet wrap={MainLayout}>
          <RouterSet wrap={ModelLayout} title="User Profile">
            <Route path="/userProfile" page={UserProfilePage} name="userProfile" />
          </RouterSet>
          <PrivateSet unauthenticated="login" roles={['Admin', 'Coordinator']}>
            <RouterSet wrap={ModelLayout}>
              <Route path="/admin" page={AdminPage} name="admin" />
              <Route path="/admin/settings" page={SettingsPage} name="settings" />
            </RouterSet>
            <RouterSet wrap={ModelLayout} title="Docket Sheets" titleTo="docketSheets">
              <Route path="/admin/docket-sheets" page={DocketSheetsPage} name="docketSheets" />
            </RouterSet>
            <RouterSet wrap={ModelLayout} title="Edit Option Sets" titleTo="editOptions">
              <Route path="/admin/editOptions" page={EditOptionsPage} name="editOptions" />
              <Route path="/admin/editOptions/{id:Int}" page={EditOptionsPage} name="editOptionSet" />
              <Route path="/admin/editOptions/new" page={EditOptionsPage} name="createOptionSet" />
            </RouterSet>
            <RouterSet wrap={ModelLayout} title="Edit Site Help">
              <Route path="/admin/edit-help" page={EditHelpPage} name="editHelp" />
            </RouterSet>
            <RouterSet wrap={ModelLayout} title="Users" titleTo="users" buttonTo="newUser">
              <Route path="/admin/users/new" page={UserUserPage} name="newUser" />
              <Route path="/admin/users/{id:Int}" page={UserUserPage} name="user" />
              <Route path="/admin/users" page={UserUsersPage} name="users" />
            </RouterSet>
            <RouterSet wrap={ModelLayout} title="Actions" titleTo="actions" buttonTo="newAction">
              <Route path="/admin/actions/new" page={ActionActionPage} name="newAdminAction" />
              <Route path="/admin/actions/{id:Int}" page={ActionActionPage} name="AdminAction" />
              <Route path="/admin/actions" page={ActionActionsPage} name="AdminActions" />
            </RouterSet>
          </PrivateSet>
          <PrivateSet unauthenticated="documents" roles={['Operator', 'Coordinator', 'Admin']}>
            <RouterSet wrap={ModelLayout} title="Arrests" titleTo="arrests" buttonTo="newArrest">
              <Route path="/arrests/new" page={ArrestArrestPage} name="newArrest" />
              <Route path="/arrests/{id:Int}" page={ArrestArrestPage} name="arrest" />
              <Route path="/arrests" page={ArrestArrestsPage} name="arrests" />
              <Route path="/arrests/{id:Int}/compare/{compareId:Int}" page={ArrestCompareArrestPage} name="compareArrest" />
              <Route path="/arrests/duplicates" page={ArrestArrestDuplicatesPage} name="findDuplicateArrests" />
              <Route path="/arrests/duplicates/{id:Int}/compare/{compareId:Int}" page={ArrestCompareArrestPage} name="findDuplicateArrestsCompare" />
            </RouterSet>
            <RouterSet wrap={ModelLayout} title="Actions" titleTo="actions" buttonTo="newAction">
              <Route path="/actions" page={ActionActionsPage} name="actions" />
              <Route path="/actions/new" page={ActionActionPage} name="newAction" />
              <Route path="/actions/{id:Int}" page={ActionActionPage} name="action" />
              <Route path="/actions/{id:Int}/whiteboard" page={ActionActionWhiteboardPage} name="actionWhiteboard" />
            </RouterSet>
            <RouterSet wrap={ModelLayout} title="Logs" titleTo="logs" buttonTo="logs" buttonParams={{ new: true }} buttonLabel="New Log">
              <Route path="/logs" page={LogLogsPage} name="logs" />
            </RouterSet>
          </PrivateSet>
          <RouterSet wrap={ModelLayout} title="Documents" titleTo="documents">
            <Route path="/documents" page={DocumentsDocumentsPage} name="documents" />
            <Route path="/documents/{id:String}" page={DocumentsDocumentPage} name="document" />
            <Route path="/documents/new" page={DocumentsDocumentPage} name="newDocument" />
          </RouterSet>
          <Route path="/help" page={DocumentationPage} name="help" />
          <Route path="/" redirect={role ? (role === 'Restricted' ? 'documents' : 'arrests') : 'login'} name="home" />
        </RouterSet>
      </PrivateSet>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
