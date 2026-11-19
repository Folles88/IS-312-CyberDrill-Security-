import type { Scenario } from '../types'

// Phishing email leads to an email account takeover.
// Topics: MFA fatigue, business email compromise (BEC), inbox rules and app access
// used for persistence, and each incident response step.
// Company, people, domains and IPs are all made up (IPs are from the example ranges).
export const phishingTakeover: Scenario = {
  id: 'phishing-takeover',
  title: 'Phishing Account Takeover',
  summary: 'A fake invoice email leads to a hijacked mailbox. Work the incident from first report to lessons learned.',
  briefing:
    'You are the security analyst at Harbor Point Supply, a fictional distribution company with 200 staff. ' +
    'Staff sign in to company email with a password and a push notification on their phone (MFA). ' +
    'It is 9:20 a.m. on a Tuesday.',
  start: 'report',
  steps: [
    {
      id: 'report',
      phase: 'Detection',
      prompt:
        'The help desk forwards a ticket from Dana in accounts payable. She opened an email about an overdue ' +
        'invoice, clicked the link, and signed in to view the invoice. Now her Sent folder has a message she ' +
        'did not write. What do you do first?',
      evidence: [
        'From: Accounts <billing@harb0rpoint-invoices.example>',
        'Subject: URGENT: Invoice #44871 overdue - payment on hold',
        'Link in email: https://harborpoint-sso.example.net/login',
        'Dana > Sent: "Updated bank details for invoice #44871" to vendor@example.com',
      ],
      choices: [
        {
          id: 'a',
          label: "Treat it as a likely account compromise: open an incident and review Dana's sign-in and mailbox activity",
          next: 'logs',
          points: 10,
          feedback:
            'A lookalike sender ("harb0rpoint" with a zero), an urgent payment request and a sent ' +
            'message Dana did not write all point to a compromised account. Investigating before acting tells ' +
            'you how far it goes.',
        },
        {
          id: 'b',
          label: "Reset Dana's password and close the ticket",
          next: 'still-active',
          points: 3,
          feedback:
            'Partly right. A reset is a good step, but closing the ticket without investigating misses what the ' +
            'attacker may have left behind. Signed-in sessions and mailbox rules can survive a password reset.',
        },
        {
          id: 'c',
          label: 'Tell Dana it is probably spam and to delete the email',
          next: 'vendor-call',
          points: 0,
          feedback:
            'Harmful. Dana entered her password on a fake sign-in page, and her account is already sending mail. ' +
            'Ignoring it gives the attacker more time.',
        },
      ],
    },
    {
      id: 'still-active',
      phase: 'Detection',
      prompt:
        "11:45 a.m. Even after the password reset, Dana's account sends another \"updated bank details\" email. " +
        'What now?',
      evidence: [
        'Session for dana.k started 09:11 from 203.0.113.45 - still active',
        'Inbox rule: messages from *@example.com -> move to "RSS Feeds" folder',
      ],
      choices: [
        {
          id: 'a',
          label: "Open an incident and review Dana's sign-in and mailbox activity properly",
          next: 'logs',
          points: 1,
          feedback:
            'Right call, but later than it should have been. The attacker kept a signed-in session that the reset ' +
            'did not end, and an inbox rule hides vendor replies from Dana.',
        },
        {
          id: 'b',
          label: 'Reset the password again',
          next: 'logs',
          points: 0,
          feedback:
            'A second reset does not end a session that is already signed in. Your manager escalates it to a full ' +
            'incident.',
        },
      ],
    },
    {
      id: 'vendor-call',
      phase: 'Detection',
      prompt:
        'The next morning, a vendor calls. They received an email from Dana asking them to send a $48,000 ' +
        'payment to a new bank account, and they almost paid it. What do you do?',
      choices: [
        {
          id: 'a',
          label: "Escalate it as a security incident and review Dana's sign-in and mailbox activity",
          next: 'logs',
          points: 1,
          feedback:
            'Correct now, but a day late. This is business email compromise (BEC): a hijacked mailbox used to ' +
            'redirect payments. It nearly cost a vendor $48,000.',
        },
        {
          id: 'b',
          label: 'Tell the vendor to ignore the email and move on',
          next: 'logs',
          points: 0,
          feedback:
            "The attacker still controls Dana's mailbox and will try again. Your manager escalates it to a full " +
            'incident.',
        },
      ],
    },
    {
      id: 'logs',
      phase: 'Analysis',
      prompt: "Here is Dana's sign-in log from the morning she clicked the link. What best explains it?",
      evidence: [
        "09:02  MFA push sent to Dana's phone - Denied",
        "09:04  MFA push sent to Dana's phone - Denied",
        "09:07  MFA push sent to Dana's phone - Denied",
        "09:11  MFA push sent to Dana's phone - Approved",
        '09:11  Sign-in SUCCESS  user=dana.k  ip=203.0.113.45  location=overseas  device=unrecognized',
        '09:14  New inbox rule: forward all mail to dk.invoices@mail.example.org',
      ],
      choices: [
        {
          id: 'a',
          label:
            'The fake page stole her password, the attacker sent MFA prompts until she approved one, then set up ' +
            'mail forwarding',
          next: 'contain',
          points: 10,
          feedback:
            'Correct. Repeated push prompts until the user gives in is called MFA fatigue (or push bombing). The ' +
            'unrecognized device, overseas IP address and new forwarding rule confirm an attacker signed in.',
        },
        {
          id: 'b',
          label: 'Dana was working from home over a VPN',
          next: 'contain',
          points: 0,
          feedback:
            'This does not fit the evidence. Dana did not deny her own sign-in three times, and a VPN would not ' +
            'create a rule forwarding her mail outside the company.',
        },
        {
          id: 'c',
          label: 'Someone tried to brute-force her password and failed',
          next: 'contain',
          points: 2,
          feedback:
            'Close, but the sign-in at 09:11 succeeded. The attacker already had the correct password from the ' +
            'fake page. They only needed her to approve the MFA prompt.',
        },
      ],
    },
    {
      id: 'contain',
      phase: 'Containment',
      prompt: "You have confirmed Dana's account is compromised. What is your first containment action?",
      choices: [
        {
          id: 'a',
          label: "Revoke all of Dana's signed-in sessions, reset her password, and make her set up MFA again",
          next: 'scope',
          points: 10,
          feedback:
            'Ending every session removes the attacker right away, and re-registering MFA makes sure ' +
            'they did not add their own device.',
        },
        {
          id: 'b',
          label: "Delete Dana's account permanently",
          next: 'scope',
          points: 2,
          feedback:
            'It stops the attacker, but deleting the account destroys evidence (her mailbox and logs) and stops ' +
            'Dana from working. Disable or secure the account instead.',
        },
        {
          id: 'c',
          label: "Wipe and reinstall Dana's laptop",
          next: 'scope',
          points: 3,
          feedback:
            'The compromise is in her cloud email account, not her laptop, so the attacker stays signed in. ' +
            'Wiping also destroys possible evidence.',
        },
      ],
    },
    {
      id: 'scope',
      phase: 'Analysis',
      prompt: 'Checking the email system shows Dana was not the only target. What do you do?',
      evidence: [
        'Message trace: "URGENT: Invoice #44871 overdue" delivered to 14 employees',
        'Link clicks: dana.k, marco.r, priya.s',
      ],
      choices: [
        {
          id: 'a',
          label:
            "Remove the email from every mailbox, block the sender and the link, and check Marco's and Priya's " +
            'accounts the same way',
          next: 'persist',
          points: 10,
          feedback:
            'Scoping the incident finds every affected account, and removing the email stops anyone ' +
            'else from clicking.',
        },
        {
          id: 'b',
          label: "Only deal with Dana's account, since she reported it",
          next: 'second-account',
          points: 0,
          feedback: 'Two other people clicked the same link. Their accounts may be compromised too.',
        },
        {
          id: 'c',
          label: 'Email all staff asking anyone who clicked to contact IT',
          next: 'persist',
          points: 4,
          feedback:
            'Helpful, but people may not notice or admit they clicked. You already know who clicked, so act on ' +
            'that and remove the email everywhere.',
        },
      ],
    },
    {
      id: 'second-account',
      phase: 'Detection',
      prompt:
        "Two days later, Marco's account starts sending the same phishing email to other employees. His account " +
        'was compromised too. What now?',
      choices: [
        {
          id: 'a',
          label: 'Remove the email from every mailbox, block the sender and link, and secure every account that clicked',
          next: 'persist',
          points: 1,
          feedback:
            "Correct, but two days late. Marco's account was used to spread the attack inside the company. Always " +
            'check everyone who received the email.',
        },
        {
          id: 'b',
          label: "Reset only Marco's password",
          next: 'persist',
          points: 0,
          feedback:
            'That still leaves Priya, the original email in 14 mailboxes, and any sessions already signed in. ' +
            'Your manager takes over the cleanup.',
        },
      ],
    },
    {
      id: 'persist',
      phase: 'Eradication',
      prompt: "While cleaning up Dana's mailbox, you find what the attacker left behind. What do you do?",
      evidence: [
        'Inbox rule "x": forward all mail to dk.invoices@mail.example.org',
        'Inbox rule ".": move messages from *@example.com to "RSS Feeds"',
        'App "Invoice Viewer" (unknown publisher): allowed to read and send mail as dana.k',
      ],
      choices: [
        {
          id: 'a',
          label:
            "Remove both rules, revoke the unknown app's access, and check Marco's and Priya's accounts for the " +
            'same changes',
          next: 'recover',
          points: 10,
          feedback:
            'Rules and app permissions are ways attackers keep access (persistence). They keep ' +
            'working after a password reset, so each one must be removed.',
        },
        {
          id: 'b',
          label: 'Leave them, since the password reset already locked the attacker out',
          next: 'recover',
          points: 0,
          feedback:
            "Harmful. The forwarding rule keeps sending Dana's mail to the attacker, and the app can still read " +
            'and send mail without her password.',
        },
        {
          id: 'c',
          label: 'Remove only the forwarding rule',
          next: 'recover',
          points: 4,
          feedback:
            'A good start, but the hiding rule and the app permission are still there. The app alone lets the ' +
            'attacker keep sending mail as Dana.',
        },
      ],
    },
    {
      id: 'recover',
      phase: 'Recovery',
      prompt: "Dana's account is clean. How do you return it to normal use?",
      choices: [
        {
          id: 'a',
          label: 'Restore her access, confirm MFA works, and watch the account closely for unusual sign-ins over the next few weeks',
          next: 'lessons',
          points: 10,
          feedback:
            'Recovery means returning to normal operations while monitoring for signs the attacker ' +
            'is trying to get back in.',
        },
        {
          id: 'b',
          label: 'Give her access back and close the incident immediately',
          next: 'lessons',
          points: 3,
          feedback:
            'Restoring access is right, but skipping the monitoring means you might miss the attacker trying ' +
            'again with what they learned.',
        },
        {
          id: 'c',
          label: 'Keep her locked out for a week, just to be safe',
          next: 'lessons',
          points: 2,
          feedback:
            'Her account is already clean, so this adds no security. It only stops accounts payable from working.',
        },
      ],
    },
    {
      id: 'lessons',
      phase: 'Lessons learned',
      prompt: 'The incident is resolved. What is the best way to close it out?',
      choices: [
        {
          id: 'a',
          label:
            'Hold a lessons-learned meeting and act on it: number-matching MFA, phishing training on fake ' +
            'invoices, a call-back rule for bank detail changes, and an updated playbook',
          next: null,
          points: 10,
          feedback:
            'Number matching stops MFA fatigue, training and a call-back rule stop the payment ' +
            'scam, and an updated playbook makes the next response faster.',
        },
        {
          id: 'b',
          label: 'Formally discipline Dana for clicking the link',
          next: null,
          points: 0,
          feedback:
            'Blame makes people hide mistakes. Dana reported the problem quickly, which is exactly what you want ' +
            'staff to do.',
        },
        {
          id: 'c',
          label: 'Skip the meeting, since the incident is over',
          next: null,
          points: 0,
          feedback:
            'Without a lessons-learned review, the same weaknesses (push-approval MFA and no payment checks) are ' +
            'still there for the next attacker.',
        },
      ],
    },
  ],
}
