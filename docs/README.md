# Memoryhole User Documentation

## Entering a new arrest

### Verify the arrest has not already been entered

- Before entering info on a particular arrest, go to the top of the screen type the name of the person who you are currently entering into the "Search arrests..." input.
- Make the search as open-ended as possible, as sometimes entries are made with incomplete/misspelled names
- Arrest records that match your input will appear. Check the name and date on these arrests to see if the arrest you are searching for has already been entered.
- **Note**: the database keeps track of arrests, not people, so if someone was arrested twice, they should have an entry for each arrest. Make sure to check both the name and the the date of potential matches.
- If an entry for this arrest exists, click the search result to edit that arrest
- If you have determined the arrestee info you have is a new entry, click the **+ NEW** **ARRESTEE** button. This will bring you to new blank arrestee form

### Entering/Updating an arrest

- Fill in all fields that you know the answers to. If there are ambiguities or additional details, explain them in the open text boxes in each section.
- The highest-priority fields to fill out are:

  - Name
    - If you type one name (with no spaces) into Preferred Name and check Keep Legal Name Confidential, the preferred name will replace the legal first name in the arrest table view, and an asterisk will show after the name.
    - If you type two names (with a space between) into Preferred Name and check Keep Legal Name Confidential,  the preferred name will replace both the first and last legal name in table view, followed by an asterisk.
    - If someone's preferred first name has a space in it, enter a period instead of a space (so Mary Anne would be Mary.Anne) to avoid replacing the last name.
    - If "Keep Legal Name Confidential" box is not checked, the legal first name will be enclosed by parentheses in the table view. This is the default format for a name in table view when the Confidential box is not checked: `PreferredName (LegalFirstName) LegalLastName`
  - Date of birth - helps us track folks through jails and courts
  - Phone number and email
  - Triage issues if applicable
  - Arrest date, city, and jursidiction (this will be autofilled if you have an Action selected in the dropdown menu near the top right hand corner of the screen in the navbar.)
  - Release type - Helps us keep track of who is in custody. If you know they're out, but don't know how, just change to 'unknown released.' If they're in custody, leave as 'unknown/ In custody'
  - Action (This will be autofilled if an Action is selected in the dropdown menu at the top of the screen.)
  - In "Arrest Info" section explain how the arrest was confirmed: did someone witness it on the street, did you get a call from jail, from a comrade who knows for a fact their friend was arrested, etc. If it's a report from a witness, describe exactly what they saw.
  - If the person has already been booked:
    - Charges
    - Citation number/Docket Number/CEN - this helps us track their case
    - Next court date - this is important to help us find them representation
    - PFN/Booking Number & Jail facility- (only if they are still in custody) - helps us identify them in the jail
    - Any info about bail (bail amount, eligibility, consent to be bailed, cosigner)

- When done with entry its very important to click the **SAVE ARRESTEE** button at bottom of screen
- The database automatically records the user and the date/time for each arrest creation and the user and date/time of the most recent edit

**Remember to log out when you are done!**

## Advanced Features

### Customizing the arrests table

From the arrests page, you can adjust which columns appear, and filter/sort the columns. Any changes you make will persist in your browser.

#### Adding Columns

Click the "three vertical bars" icon in the upper right of the table. This will open a pane that lets you toggle which columns should appear on the table.

#### Reordering Columns

You can adust the order of columns by clicking/dragging the "two horizontal lines" icon either in the columns pane mentioned above, or to the right of the column name in the table header

#### Sorting Rows

You can sort the table rows back clicking the column name in the header row. The arrow icon to the immediate right of the name will indicate which direction the sort is. If the icon is two arrows (up and down), that column is not being used for sorting

#### Filtering Rows

Click the "three horizontal lines in a triangle" icon in the upper right of the table to enable the filtering interface. An input will appear under each column heading. The table will filter that column by the value you enter in the filter input. You can also adjust the filter mode by clicking the "three vertical dots" icon next to the column header, and hovering over the triangle to the right of "Filter by <column name>". A number of filter options will appear, depending on the type of column. The default mode is 'fuzzy', which is a very inclusive match. Other options include 'equals', 'not equals', 'less than', 'greater than', etc. Note that filters on multiple columns are always an "AND" type search, meaning the table will only show rows that match ALL of the filters that have been set.

### Saving/Loading 'Views'

You can save the current visible columns, sorting, and filters you have enabled on the table into a 'View' that can be loaded by you or others.

#### Saving Views

Once you have made your table modifications. you can click the 'plus' icon next to the 'Load View' dropdown in the upper-left of the table. This will open an input that will let you set a name for the view and save it

#### Loading Views

To load a saved view, select the name of the view from the 'Load View' dropdown - the table will update to show that views columns, sorting, and filters

#### Managing Views

You can rename and delete views by selecting the view from the dropdown, and clicking the 'pencil' icon to rename, or the 'trash' icon to delete. Note that views are shared by all users, so deleting one will make it unavailable to everyone,

### Bulk Operations

You can edit or delete multiple arrest records at the same time by checking the boxes on the left side of each row. This will open an interface above the table to 'Delete Selected Arrests' or 'Update Selected Arrests'. You can also check the checkbox in the header row to select _all_ rows that match the current filters (including any that may not be visible due to pagination). Note that these operations cannot be undone, so act carefully.

#### Updating Multiple Arrests

The 'Update Selected Arrests' will bring up a dialog with a dropdown on the left for choosing what field to update, and a value input on the right for what value to set that field to for all selected records. Click 'Add Field to Update' to add another row allowing you to update multiple different fields. You can also click the 'trash' icon on a row to remove a field from the update set. Clicking 'Bulk Update' will open a confirmation allowing you to review your changes before applying them

## Creating spreadsheets for Attorneys taking cases/ attorney wrangling

### Creating Docket sheets

- At top of screen open **DOCKET SHEETS**
- In drop down menu choose Jurisdiction
- Select Report Type **COURT DATE**
- Choose date you are looking for
- Check box if you are including arrestee info
- Select **CREATE DOCKET SHEET**
- **Remember to log out when you are done <3**

## Generating new users and admins

- At top of screen open **ADMIN**
- in the menu select **USERS**
- Select **+ NEW USER** button top right of screen
- Fill in **Name** and **Email** (Email should be a Proton Mail address.)
- Select the role **User**. (The role "Admin" should be restricted to coordinators.)
- Review the **Expires At** and **Minimum Arrest Date** fields.
  - Expires At is when the user's account will be disabled. (The account and password will remain, they will just no longer be able to log in)
  - Minimum Arrest Date is the earliest date that a user can search for.
- User will receive an email with a link to create their own PW. Log in credentials will expire on the time set by Admin and can be changed for the next time the User is on shift.
