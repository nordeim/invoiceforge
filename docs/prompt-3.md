Awesome job on your meticulous review, analysis and planning! Please keep up the good work in your rigorous and meticulous approach to planning and execution! Now, please meticulously plan and then create the "re-imagined* PRD with the following as my preferences/choices.

#### 🎨 Design Direction

1. **Typography Override**: Given the design guideline's prohibition on generic fonts, yes, go for alternative distinctive pairings (e.g., **"Instrument Serif"** + **"Geist"**, or **"Fraunces"** + **"Outfit"**) as you think best

2. **Aesthetic Reconciliation**: Yes, interpret "Swiss Utility" as the *foundation* (grid systems, hierarchy, purposeful whitespace) and push it toward a more **"Neo-Editorial"** or **"Precision Brutalist"** execution to satisfy the "bold/unforgettable" guideline.

3. **Accent Color**: Confirm preference:
   - [ ] Electric Blue (e.g., `blue-500`)

4. **Dark Mode Priority**: Make light (daylight) mode be the *primary* design with dark (night) mode as alternative. Include a toggle for day/night mode for this get to get more polish.

#### 📊 Functional Scope

5. **MRR Tracking**: Make the dashboard focusing on:
   - Total Outstanding
   - Total Paid (This Month / YTD)
   - Overdue Amount
   
6. **Invoice States**: Yes, the status workflow:
   ```
   Draft → Sent/Pending → Paid
                  ↓
               Overdue (auto-calculated from due date?)
   ```

7. **Invoice Numbering Format**: 
   - Date-prefixed: `2024-0001`

8. **Line Item Types**: description + qty + price, and the following - design such that it makes sense:
   - [x] Discount lines (negative amounts)
   - [x] Section headers/grouping
   - [x] Unit types (hours, items, etc.)

#### 🖥️ Technical Scope

9. **ShadCN Components**: the PRD should specify which to install with steps and/or codes

10. **Print Styling**: For the shareable invoice — yes, make it print-optimized (proper `@media print` considerations via Tailwind)?
