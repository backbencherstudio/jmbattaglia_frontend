# End-to-End Testing Guide: At Ease Inspections Booking System

This document provides a complete, step-by-step testing manual for clients, QA engineers, and administrators to test the **At Ease Inspections** platform from the **Admin Management Portal** through the **Public Order Booking Flow** and **ISN (Inspection Support Network)** integration.

---

## 📌 Table of Contents
1. [System Architecture Overview](#1-system-architecture-overview)
2. [Prerequisites & Access URLs](#2-prerequisites--access-urls)
3. [Phase 1: Admin Portal Testing (Packages & Add-ons Setup)](#3-phase-1-admin-portal-testing-packages--add-ons-setup)
4. [Phase 2: Customer Booking Flow Walkthrough (10 Steps)](#4-phase-2-customer-booking-flow-walkthrough-10-steps)
5. [Phase 3: Verification in ISN & Order Confirmation](#5-phase-3-verification-in-isn--order-confirmation)
6. [Ready-to-Use Test Scenarios & Data Sheet](#6-ready-to-use-test-scenarios--data-sheet)
7. [Troubleshooting & Validation Checklist](#7-troubleshooting--validation-checklist)

---

## 1. System Architecture Overview

The order booking ecosystem consists of 3 integrated layers:
```
┌─────────────────────────────────┐
│        Admin Portal             │  • Manage Inspection Packages & Services
│      (/admin/packages)          │  • Manage Add-ons & Category visibility
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│     Customer Booking Stepper    │  • 10-step guided booking wizard
│            ( / )                │  • Real-time ISN quote calculation
└────────────────┬────────────────┘  • Live slot availability based on duration
                 │
                 ▼
┌─────────────────────────────────┐
│  ISN (Inspection Support Net.)  │  • Real-time Order Registration
│        & Backend APIs           │  • Inspector scheduling & confirmation
└─────────────────────────────────┘
```

---

## 2. Prerequisites & Access URLs

| Portal | URL Link | Purpose |
| :--- | :--- | :--- |
| **Admin Login** | `https://jmbattaglia-frontend.vercel.app/admin/login` | Administrative package, add-on, and setting management |
| **Admin Packages** | `https://jmbattaglia-frontend.vercel.app/admin/packages` | Create, edit, toggle visibility of inspection packages |
| **Admin Add-ons** | `https://jmbattaglia-frontend.vercel.app/admin/add-ons` | Manage optional services and add-ons |
| **Customer Booking** | `https://jmbattaglia-frontend.vercel.app` | Public interactive 10-step booking stepper |

> 🔑 **Admin Test Credentials**:
> - **Email**: `shohidullah1112@student.nstu.edu.bd`
> - **Password**: `123456789123`

---

## 3. Phase 1: Admin Portal Testing (Packages & Add-ons Setup)

Before testing client booking, verify that packages and add-ons are properly configured and marked active/visible in the Admin Portal.

### Step 1.1: Log into the Admin Portal
1. Navigate to: [https://jmbattaglia-frontend.vercel.app/admin/login](https://jmbattaglia-frontend.vercel.app/admin/login)
2. Enter your Admin test credentials:
   - **Email**: `shohidullah1112@student.nstu.edu.bd`
   - **Password**: `123456789123`
3. Click **Sign In**.
4. **Expected Result**: Successfully redirected to the Admin Dashboard.

### Step 1.2: Check / Create Packages (`/admin/packages`)
1. In the sidebar, click **Packages** (or go to [https://jmbattaglia-frontend.vercel.app/admin/packages](https://jmbattaglia-frontend.vercel.app/admin/packages)).
2. Filter by category: **Resale Home** vs **New Construction**.
3. **Verify Existing Packages**:
   - Check that packages have a Title, Starting Price, Description, Category, and Status (**Active/Visible**).
4. **Test Creating / Editing a Package (Optional)**:
   - Click **+ Create Package** or the edit icon on an existing package.
   - Verify:
     - **Package Name**: e.g., *"Safe Home Inspection Package"*
     - **Category**: Select `RESALE_HOME` or `NEW_CONSTRUCTION`
     - **Services Included**: Check off the primary inspection services included in this package.
     - **Features & Why It Matters**: Informational bullet points for clients.
     - **Recommended Badge**: Toggle on if it is the "Most Popular" or "Best Value" package.
     - **Visibility**: Ensure the package is set to **Visible** so it appears on the public booking portal.
5. Click **Save / Publish**.

### Step 1.3: Check / Create Add-ons (`/admin/add-ons`)
1. In the sidebar, click **Add-ons** (or go to [https://jmbattaglia-frontend.vercel.app/admin/add-ons](https://jmbattaglia-frontend.vercel.app/admin/add-ons)).
2. **Verify Add-on Items**:
   - Ensure common add-ons exist (e.g., *Radon Testing*, *Sewer Scope Inspection*, *Thermal Imaging*, *Pool & Spa Inspection*).
   - Ensure prices are populated (e.g., $150.00).
   - Verify category assignment: `RESALE_HOME`, `NEW_CONSTRUCTION`, or available to both.
3. Ensure status is set to **Active**.

---

## 4. Phase 2: Customer Booking Flow Walkthrough (10 Steps)

Open the public customer booking URL: [https://jmbattaglia-frontend.vercel.app](https://jmbattaglia-frontend.vercel.app) in an incognito/private window.

```
Step 1: About You ──────► Step 2: Property Info ──────► Step 3: Packages & Add-ons ──────► Step 4: Schedule ──────► Step 5: Confirmation
  ├─ Who it's for           ├─ Inspection Type            ├─ Package Selection              ├─ Date & Time            └─ Order Confirmed
  ├─ Customer Type          ├─ Property Address           ├─ Service Customization          └─ Full Review
  └─ Contact Info           └─ Property Details           └─ Live Quote Calculation
```

---

### Step 1: Who It's For (`about-you` ➔ `who-its-for`)
- **Action**: Select who is initiating the inspection request:
  - *"I am buying a home"* (Default)
  - *"I am selling a home"*
  - *"I am an agent representing a client"*
- Click **Next Step**.

### Step 2: Customer Role (`about-you` ➔ `customer-type`)
- **Action**: Specify your exact role in the transaction:
  - **Home Buyer**
  - **Home Owner**
  - **Buyer's Agent**
- Click **Next Step**.

### Step 3: Contact Information (`about-you` ➔ `your-info`)
- **Action**: Fill in the client's contact details:
  - **First Name**: e.g., `John`
  - **Last Name**: e.g., `Doe`
  - **Email**: e.g., `john.doe@example.com`
    *(Notice: Entering an existing client email triggers automatic background lookup to prefill existing information).*
  - **Phone Number**: e.g., `(404) 555-0199` *(Format: 7–30 characters standard US phone).*
  - **Billing Address (optional)**: Check "Same as inspection property" or fill separately.
- Click **Next Step**.

---

### Step 4: Inspection Type (`property-info` ➔ `inspection-type`)
- **Action**: Choose the building condition:
  - **Resale Home Inspection** (Pre-existing home)
  - **New Construction** (Newly built home)
- **Key Verification Point**: 
  > ⚠️ The choice here dynamically filters which packages and add-ons are displayed in Step 7!

### Step 5: Property Address (`property-info` ➔ `property-address`)
- **Action**: Enter the physical inspection site:
  - **Street Address**: e.g., `124 Peach Tree St NE`
  - **Unit / Apt / Suite**: (Optional) e.g., `Apt 4B`
  - **City**: e.g., `Atlanta`
  - **State**: e.g., `GA`
  - **Zip Code**: e.g., `30303`
  - **MLS #**: (Optional) e.g., `MLS-987654`
- Click **Next Step**.

### Step 6: Property Details (`property-info` ➔ `property-details`)
- **Action**: Input structural parameters (these drive the ISN live pricing engine):
  - **Approx. Square Footage**: e.g., `2400` sq ft
  - **Year Built**: e.g., `1998`
  - **Foundation Type**: Select from dropdown (e.g., *Basement*, *Slab*, *Crawl Space*)
  - **Detached Structures**: (Optional) e.g., Detached garage, shed, or None
  - **Number of HVAC Units**: e.g., `1` or `2`
- Click **Next Step**.

---

### Step 7: Packages & Add-ons (`packages-addons` ➔ `package-addons`)
- **Verification Checklist**:
  1. **Dynamic Packages**: Verify that the packages loaded match the ones configured in the Admin Portal for the selected category (`RESALE_HOME` vs `NEW_CONSTRUCTION`).
  2. **Package Selection**: Click to select a package (e.g., *"Safe Home Inspection"*).
  3. **Accordion Details**: Expand the package card to view what is included (Foundation, Roofing, HVAC, Electrical, etc.).
  4. **Optional Add-ons**: Check one or more add-ons (e.g., *Radon Testing +$150*, *Thermal Imaging +$95*).
  5. **Real-time Live Quote Calculation**:
     - Notice the sticky **"Package Amounts"** summary card on the right column.
     - The base package price + selected add-ons are recalculated.
     - Behind the scenes, `/portal/calculateservicequote` communicates with ISN and generates a live `quoteId`.
- Click **Next Step**.

---

### Step 8: Inspection Date & Time (`schedule` ➔ `date-time`)
- **Verification Checklist**:
  1. **Interactive Calendar**: Select a desired inspection date (e.g., tomorrow or next business day).
  2. **Dynamic Slot Fetching**: 
     - The system queries `/portal/availableslots` with the `quoteId` and chosen date.
     - Slots are calculated based on the exact required duration for the selected package + add-ons.
  3. **Time Slot Selection**: Select an available slot (e.g., `09:00 AM` or `01:30 PM`).
  4. Notice the inspector details and estimated inspection duration.
- Click **Next Step**.

---

### Step 9: Review & Verification (`schedule` ➔ `review`)
- **Verification Checklist**:
  - **Customer Details**: Name, email, phone number.
  - **Property Summary**: Full address, square footage, year built, foundation type.
  - **Selected Package & Add-ons**: Itemized list with individual prices.
  - **Appointment Details**: Confirmed date, time, and inspector.
  - **Total Quote Amount**: Total matching the live ISN quote calculation.
  - **Edit Quick Links**: Clicking "Edit" next to any section allows jumping directly back to that step.
- Click **Complete Booking / Submit Order**.

---

### Step 10: Order Confirmation (`confirmation`)
- **Expected Outcome**:
  - An animated success screen appears: **"You're Confirmed. A Home Decision, Made Clearer."**
  - Displays a unique **Order ID / Reference ID** (e.g., `ORD-8F2B9C1A` or ISN Order ID).
  - Shows appointment summary (Date, Time, Location).
  - Draft data in browser storage is safely cleared.
  - A button **"Book Another Inspection"** is provided to restart a clean order.

---

## 5. Phase 3: Verification in ISN & Order Confirmation

To confirm that the end-to-end integration succeeded:

1. **Log into ISN (Inspection Support Network)** portal:
   - Navigate to the **Orders / Inspections List**.
   - Search for the customer name (e.g., `John Doe`) or the property address.
2. **Verify Order Details in ISN**:
   - [x] Correct Customer Name, Email, and Phone.
   - [x] Inspection Address, Square Feet, and Year Built.
   - [x] Scheduled Date and Time Slot.
   - [x] Assigned Inspector ID.
   - [x] Primary Package Service and selected Add-on line items.
   - [x] Final Quoted Fee matches the customer's total on the confirmation step.
3. **Automated Notification**:
   - Verify that confirmation emails/SMS (configured in ISN) are triggered to the client and inspector.

---

## 6. Ready-to-Use Test Scenarios & Data Sheet

Use these 3 standard scenarios during user acceptance testing (UAT):

### Scenario A: Standard Resale Home Inspection (Single Buyer)
| Field | Test Value |
| :--- | :--- |
| **Who it's for** | I am buying a home |
| **Customer Role** | Home Buyer |
| **Customer Name** | Alice Walker |
| **Email** | `alice.tester@mailinator.com` |
| **Phone** | `(404) 555-0144` |
| **Inspection Type** | Resale Home Inspection |
| **Address** | `742 Evergreen Terrace, Atlanta, GA 30301` |
| **Property Specs** | 2,200 sq ft, Built in 2005, Foundation: Slab, 1 HVAC unit |
| **Package** | Safe Home Package (or Primary Resale Package) |
| **Add-ons** | Radon Testing |
| **Schedule** | Choose any morning slot (e.g., 9:00 AM) |
| **Expected Result** | Order completes with instant Order ID; shows in ISN with Radon service added. |

---

### Scenario B: New Construction Inspection with Multiple Add-ons
| Field | Test Value |
| :--- | :--- |
| **Who it's for** | I am buying a home |
| **Customer Role** | Home Buyer |
| **Customer Name** | Robert Miller |
| **Email** | `robert.miller.test@mailinator.com` |
| **Phone** | `(678) 555-0182` |
| **Inspection Type** | New Construction |
| **Address** | `105 Innovation Way, Alpharetta, GA 30009` |
| **Property Specs** | 3,800 sq ft, Built in 2024, Foundation: Basement, 2 HVAC units |
| **Package** | New Construction Premier Package |
| **Add-ons** | Thermal Imaging + Sewer Scope |
| **Schedule** | Choose an afternoon slot (e.g., 1:30 PM) |
| **Expected Result** | Duration adjusts for larger sq footage + add-ons; order books successfully. |

---

### Scenario C: Real Estate Agent Booking for Buyer
| Field | Test Value |
| :--- | :--- |
| **Who it's for** | I am an agent representing a client |
| **Customer Role** | Buyer's Agent |
| **Agent Name** | Sarah Jenkins (Agent) |
| **Agent Email** | `sarah.agent@realtytest.com` |
| **Agent Phone** | `(770) 555-0199` |
| **Buyer Name** | David Brown (Client) |
| **Inspection Type** | Resale Home Inspection |
| **Address** | `450 Piedmont Ave NE, Atlanta, GA 30308` |
| **Expected Result** | Both Agent contact and Buyer contact are transmitted into the order payload. |

---

## 7. Troubleshooting & Validation Checklist

| Issue Observed | Root Cause | Solution |
| :--- | :--- | :--- |
| **"No inspection packages available"** | Packages are not marked `Visible` in Admin or category mismatch. | Go to `/admin/packages`, check that package category matches (`RESALE_HOME` vs `NEW_CONSTRUCTION`) and visibility toggle is ON. |
| **"Could not retrieve a valid ISN quote"** | Missing required property specs (Sq ft, Year built, Foundation). | Ensure Square Footage and Year Built are valid numbers and foundation type is chosen. |
| **"No available time slots on this date"** | Inspection duration exceeds remaining working hours on that day, or inspector schedule is full. | Select an alternate date on the calendar or choose a date with open morning availability. |
| **"A valid phone number is required"** | Phone input has fewer than 7 digits or invalid characters. | Enter a standard 10-digit US phone (e.g., `(404) 555-0100`). |
| **Duplicate order submission prevention** | Double-clicking the submit button. | The system uses a UUID `idempotencyKey` so accidental double clicks never create duplicate charges or orders. |

---

*Document Version: 1.0.0 — Created for At Ease Inspections Portal Integration & UAT testing.*
