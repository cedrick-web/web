# DevSprint V1 Checkout & Delivery Architecture

## Decision

Use **Payhip + Flutterwave** as the initial checkout and digital-delivery stack.

Payhip is responsible for the storefront, product page, checkout integration, and protected digital delivery. Flutterwave is the payment processor connected to Payhip.

This keeps DevSprint from building payment handling, file delivery, customer access, and payment verification from scratch during V1.

## Why this stack

- Payhip supports digital products and automatic post-purchase delivery.
- Payhip supports Flutterwave in Rwanda.
- Flutterwave supports Rwanda card and Mobile Money payments, including MTN and Airtel.
- Flutterwave also supports international card payments.
- The product can therefore start globally while retaining a practical Rwanda payment path.

## Customer flow

```text
DevSprint website / content
        ↓
Sales page
        ↓
Payhip product page / checkout
        ↓
Flutterwave payment
        ↓
Successful payment
        ↓
Payhip download page + email receipt
        ↓
Customer receives V1 toolkit
```

## Product configuration

Product name:

**JavaScript Problem-Solving & DSA Toolkit**

Launch price:

**US$9 one-time**

Product type:

**Digital Product**

Recommended initial visibility:

**Unlisted while testing**, then **Visible** after launch QA.

## Files to upload

The final customer package should contain:

```text
DevSprint-JavaScript-Problem-Solving-Toolkit-V1.zip
```

The ZIP should contain the complete approved V1 package defined in:

`products/javascript-toolkit/V1-PACKAGE-MANIFEST.md`

Do not upload unfinished source material or internal business documents.

## Payhip setup checklist

1. Create/sign into Payhip.
2. Create a Digital Product.
3. Set the title to `JavaScript Problem-Solving & DSA Toolkit`.
4. Set the launch price to `$9`.
5. Upload the final V1 ZIP.
6. Add the approved sales description.
7. Add the product cover image.
8. Connect Flutterwave under Payhip payment settings.
9. Confirm the Payhip currency matches the Flutterwave account currency configuration.
10. Keep the product Unlisted during testing.
11. Create a 100% discount test coupon.
12. Complete a test checkout as a customer.
13. Verify the download page.
14. Verify the receipt/download email.
15. Verify that the downloaded ZIP opens correctly.
16. Verify every expected file is present.
17. Verify the payment record in the payment dashboard.
18. Verify refund handling before public launch.
19. Replace the website checkout placeholder with the real public checkout URL.
20. Run website QA again.
21. Change the Payhip product to Visible only after all checks pass.

## Payment configuration rules

Never place Flutterwave secret keys in the React/Vite frontend.

The website only needs the public checkout destination. Payment credentials belong inside the payment provider / Payhip configuration, not inside GitHub source code.

Never commit:

- Flutterwave Secret Key
- API credentials
- Passwords
- private webhook secrets
- customer payment information

## Website checkout configuration

Until the real Payhip checkout URL exists, the website must use an explicit placeholder such as:

```text
CHECKOUT_URL=TO_BE_CONNECTED
```

The website must not display language implying that payment is already live while the URL is still a placeholder.

## Test matrix

### Payment tests

- Rwanda MTN Mobile Money
- Rwanda Airtel Money
- Rwanda card
- International card where enabled/approved
- Failed payment
- Cancelled checkout
- Successful payment

### Delivery tests

- Download page appears after successful payment
- Receipt email arrives
- Download link works
- ZIP opens
- All expected files exist
- No internal/private files are exposed
- Customer can retrieve the product again using the provider's supported access flow

### Product tests

- Price displays correctly
- Product title is correct
- Description matches the actual product
- Number of challenges is 60
- Module count is correct
- V1 version is consistent
- Final Project is included
- Debugging Lab is included
- Assessment Simulator is included

## Launch gate

DevSprint V1 is **not live** until all of the following are true:

- Real checkout URL exists.
- Payment provider account is verified and usable.
- At least one successful end-to-end test purchase has completed.
- Download delivery has been verified.
- Refund procedure has been verified/documented.
- Website checkout button points to the real checkout.
- Repository QA passes.
- Final downloadable package matches the manifest.

## Important Rwanda note

Flutterwave currently documents Rwanda support for card and Mobile Money collections, with MTN and Airtel listed for Mobile Money. Current Flutterwave pricing and account requirements must be checked in the live dashboard before launch because fees, approval requirements, limits, and eligibility can change.

## Source references

- Payhip + Flutterwave connection: https://help.payhip.com/article/367-connect-your-flutterwave-account
- Payhip digital product delivery: https://help.payhip.com/article/59-adding-a-digital-product
- Flutterwave Rwanda payment methods: https://www.flutterwave.com/rw/support/payment-methods/pay-with-mobile-money
- Flutterwave Rwanda pricing: https://flutterwave.com/rw/pricing
