import type { Scenario } from '../types'

// Short 3-step warm-up. The screen test plays through this one.
export const usbDrop: Scenario = {
  id: 'usb-drop',
  title: 'Warm-up: The Found USB Drive',
  summary: 'An employee finds a USB drive in the parking lot. Three quick decisions.',
  briefing:
    'You are the security analyst at Harbor Point Supply, a fictional distribution company. ' +
    'It is Monday morning, and an employee is standing at your desk holding something they found.',
  start: 'found',
  steps: [
    {
      id: 'found',
      phase: 'Detection',
      prompt:
        'Sam from shipping found a USB drive labeled "Q4 Salary Review" in the parking lot. ' +
        'Sam has not plugged it in. What do you do with it?',
      choices: [
        {
          id: 'a',
          label: 'Plug it into your work computer to see who it belongs to',
          next: 'analyze',
          points: 0,
          feedback:
            'Risky. A drive left where staff will find it is a classic baiting attack. Plugging it into a ' +
            'networked work computer can run malware the moment it connects.',
        },
        {
          id: 'b',
          label: 'Keep it sealed and examine it on an isolated analysis machine that is not on the network',
          next: 'analyze',
          points: 10,
          feedback:
            'An isolated machine (a sandbox) lets you see what the drive contains without ' +
            'putting the company network at risk.',
        },
        {
          id: 'c',
          label: 'Hand it in to the lost and found',
          next: 'analyze',
          points: 2,
          feedback:
            'Not ideal. Someone else may plug it in to find the owner. Suspicious devices should go to ' +
            'the security team.',
        },
      ],
    },
    {
      id: 'analyze',
      phase: 'Analysis',
      prompt: 'On the isolated machine, the drive shows the following. What does it tell you?',
      evidence: [
        'Device connected: class = Mass Storage + HID Keyboard',
        'Files: Salary_Review.pdf.exe (2.1 MB)',
      ],
      choices: [
        {
          id: 'a',
          label:
            'It is malicious: the "PDF" is really a program, and the drive also pretends to be a keyboard ' +
            'so it can type commands on its own',
          next: 'report',
          points: 10,
          feedback:
            'Correct. ".pdf.exe" is a double extension that hides a program behind a document name, and a ' +
            'storage drive that also reports itself as a keyboard is a sign of a keystroke injection device.',
        },
        {
          id: 'b',
          label: 'It is a normal drive with a salary document on it',
          next: 'report',
          points: 0,
          feedback:
            'Look again. The file ends in ".exe", so it is a program, and normal drives do not identify as ' +
            'keyboards.',
        },
        {
          id: 'c',
          label: 'The file is safe because it has a PDF icon',
          next: 'report',
          points: 0,
          feedback:
            'Icons are easy to fake. Attackers routinely give programs a document icon. The extension and ' +
            'device type are what count.',
        },
      ],
    },
    {
      id: 'report',
      phase: 'Lessons learned',
      prompt: 'The drive was malicious, and no computer was infected. What is the most useful follow-up?',
      choices: [
        {
          id: 'a',
          label:
            'Record the incident, thank Sam for not plugging it in, and send staff a short reminder about ' +
            'found USB drives',
          next: null,
          points: 10,
          feedback:
            'Recognizing good behavior encourages reporting, and a quick awareness reminder ' +
            'makes the next baiting attempt less likely to work.',
        },
        {
          id: 'b',
          label: 'Do nothing, since no harm was done',
          next: null,
          points: 0,
          feedback:
            'A near miss is still an incident worth recording. Someone targeted the company, and staff ' +
            'should know about it.',
        },
        {
          id: 'c',
          label: 'Immediately block all USB devices company-wide without telling anyone',
          next: null,
          points: 4,
          feedback:
            'Blocking USB storage with a device control policy is a real mitigation worth proposing, but ' +
            'it should go through change management and be explained to staff, or it will disrupt work.',
        },
      ],
    },
  ],
}
