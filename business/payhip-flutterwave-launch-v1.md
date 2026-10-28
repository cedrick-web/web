# DevSprint Payhip + Flutterwave Launch Setup V1

## Goal

Sell the DevSprint JavaScript Problem-Solving & DSA Toolkit V1 globally while allowing Rwandan customers to pay by card or Rwanda Mobile Money.

## Current product

- Product: JavaScript Problem-Solving & DSA Toolkit V1
- Launch price: US$9 one-time
- Delivery: digital download
- Package: `DEVSPRINT-JAVASCRIPT-PROBLEM-SOLVING-DSA-TOOLKIT-V1.zip`
- Checkout URL: `TO_BE_CONNECTED`

## Payment architecture

```text
DevSprint sales page
        ↓
Payhip product checkout
        ↓
Flutterwave
        ↓
Card / Rwanda Mobile Money
        ↓
Successful payment
        ↓
Payhip download + email receipt
```

## Step 1: Create / verify Flutterwave account

Complete the Rwanda business onboarding requirements requested by Flutterwave. Current Rwanda requirements include business registration information, valid identification, proof of address, payout details, a verifiable business website, estimated monthly sales, and an RRA Tax Clearance certificate where applicable.

Do not place Flutterwave secret keys in this repository or in the frontend website.

## Step 2: Configure Rwanda payment methods

Inside Flutterwave, enable the payment methods needed for DevSprint. For Rwanda, Mobile Money supports MTN and Airtel, and card payments are also supported.

Recommended initial configuration:

- RWF for Rwanda/local payment testing
- Rwanda Mobile Money: enabled
- Card payments: enabled
- International card acceptance: enabled if available to the verified account

## Step 3: Create the Payhip store

1. Create or sign in to Payhip.
2. Create the digital product named `JavaScript Problem-Solving & DSA Toolkit V1`.
3. Set the launch price to US$9.
4. Upload the final V1 ZIP package.
5. Keep the product unlisted while testing.
6. Connect Flutterwave under Payhip payment settings.
7. Make sure the Payhip currency matches the configured Flutterwave account currency for the intended checkout flow.

## Step 4: Connect Flutterwave to Payhip

In Payhip:

`Account → Settings → Payment Details → Flutterwave → Connect`

Payhip requests the Flutterwave public and secret keys during the connection process. Obtain them from the Flutterwave dashboard. Never commit these keys to GitHub.

## Step 5: Test before launch

Use a 100% test coupon in Payhip where supported so the complete delivery flow can be checked without charging real money.

Verify:

- checkout opens;
- product title and price are correct;
- customer email is captured;
- successful checkout completes;
- Payhip shows the download;
- download ZIP opens correctly;
- all expected product folders/files are present;
- receipt/download email is delivered;
- failed/cancelled checkout behaves correctly;
- refund procedure is documented;
- mobile checkout works;
- Rwanda Mobile Money flow works when the Flutterwave account is approved and enabled;
- international card flow works when enabled.

## Step 6: Connect the website CTA

Do not replace `CHECKOUT_URL=TO_BE_CONNECTED` with a guessed URL.

Only add the real Payhip checkout/product URL after the product exists and the end-to-end checkout has been tested.

## Launch gate

DevSprint V1 is ready for public selling only when all are true:

- [ ] Flutterwave account verified
- [ ] Required Rwanda business/payment information completed
- [ ] Payhip store created
- [ ] V1 ZIP uploaded
- [ ] Flutterwave connected to Payhip
- [ ] Test checkout completed
- [ ] Download verified
- [ ] Email delivery verified
- [ ] Rwanda Mobile Money verified where available
- [ ] Card payment verified
- [ ] Refund procedure ready
- [ ] Real Payhip URL added to website
- [ ] Website QA passes
- [ ] Product package QA passes
- [ ] Sales page reviewed
- [ ] Public launch announced

## Important commercial rule

The public website should not expose the complete paid 60-challenge workbook merely because the learning dashboard exists. The dashboard can explain the curriculum and provide appropriate previews/free content. The paid material is delivered after purchase.
