## Testing Steps

### 1. Start Development Servers
```bash
# Terminal 1
bin/rails server

# Terminal 2
bin/vite dev
```

### 2. Clients Page Load
1. Navigate to http://localhost:3000/clients
2. Verify page header shows "Clients" and "3 total clients"
3. Verify search bar is visible
4. Verify 3 clients are displayed

### 3. Desktop Table Testing (>= 768px)
1. Ensure viewport is at least 768px wide
2. Verify table is visible with all columns
3. Verify each client row shows:
   - Avatar with correct initials (AC, SL, GV)
   - Name and company
   - Email
   - Total billed (formatted as S$X,XXX.XX)
   - Last invoice date
4. Hover over a row, verify background changes
5. Click actions button (three dots)
6. Verify dropdown opens with brutalist shadow
7. Click "Edit Client"
8. Verify sheet opens with client data pre-filled

### 4. Mobile Card Testing (< 768px)
1. Set viewport to 375px
2. Verify table is hidden
3. Verify card stack is visible
4. Verify each card shows:
   - Large avatar
   - Name, company, email
   - Horizontal divider
   - Total billed and last invoice
5. Tap actions button (three dots)
6. Verify dropdown opens
7. Tap "Edit Client"
8. Verify sheet opens full width

### 5. Search Functionality
1. Type "Acme" in search bar
2. Verify only Acme Corporation shows
3. Verify message "Showing 1 of 3 clients"
4. Clear search
5. Verify all 3 clients show again
6. Type "xyz" (no matches)
7. Verify empty state or "No clients found" message

### 6. New Client Flow
1. Click "New Client" button
2. Verify sheet opens
3. Verify title is "New Client"
4. Verify all fields are empty
5. Click "Add Client" without filling anything
6. Verify name and email errors appear
7. Fill in name only
8. Click "Add Client"
9. Verify email error still shows
10. Fill in email with "invalid"
11. Verify invalid email error shows
12. Fill in email with "test@example.com"
13. Click "Add Client"
14. Verify console logs the data
15. Verify sheet closes

### 7. Edit Client Flow
1. Open actions for "Acme Corporation"
2. Click "Edit Client"
3. Verify sheet opens with title "Edit Client"
4. Verify name field shows "Acme Corporation"
5. Verify email field shows "billing@acme.corp"
6. Modify the name
7. Click "Save Changes"
8. Verify console logs updated data
9. Verify sheet closes

### 8. Avatar Color Consistency
1. Note the color for each client's avatar
2. Refresh the page
3. Verify colors are the same
4. Resize window (table → cards)
5. Verify colors remain consistent

### 9. Dark Mode Testing
1. Toggle to dark mode
2. Verify table has dark background
3. Verify cards have dark background
4. Verify form sheet has dark background
5. Verify avatar colors remain vibrant
6. Verify all text is readable

### 10. Accessibility Testing
1. Tab through the page
2. Verify focus is visible on all elements
3. Open sheet with keyboard (Enter on button)
4. Tab through form fields
5. Verify labels are read
6. Press Escape
7. Verify sheet closes
