
export interface PortData {
  port: number;
  protocol: string;
  secureAlternative: string;
  description: string;
}



export const portData: PortData[] = [
  { port: 20, protocol: "FTP Data", secureAlternative: "SFTP", description: "Used to transfer files between computers using FTP." },
  { port: 21, protocol: "FTP Control", secureAlternative: "SFTP", description: "Used to start and manage FTP connections." },
  { port: 22, protocol: "SSH", secureAlternative: "Already encrypted", description: "Lets someone securely connect to another computer remotely." },
  { port: 23, protocol: "Telnet", secureAlternative: "SSH", description: "Allows remote access to another computer, but does not encrypt the connection." },
  { port: 25, protocol: "SMTP", secureAlternative: "SMTP with TLS", description: "Used by mail servers to send email to each other." },
  { port: 53, protocol: "DNS", secureAlternative: "DNS over TLS", description: "Takes a website name and finds the IP address associated with it." },
  { port: 67, protocol: "DHCP Server", secureAlternative: "DHCP Snooping", description: "Allows a server to automatically assign IP addresses to devices." },
  { port: 68, protocol: "DHCP Client", secureAlternative: "DHCP Snooping", description: "Allows a device to receive an IP address from a DHCP server." },
  { port: 69, protocol: "TFTP", secureAlternative: "SFTP", description: "Transfers files without requiring a username or password." },
  { port: 80, protocol: "HTTP", secureAlternative: "HTTPS", description: "Used to access websites, but the information is not encrypted." },
  { port: 88, protocol: "Kerberos", secureAlternative: "Already supports secure authentication", description: "Helps verify a user's identity when accessing network resources." },
  { port: 110, protocol: "POP3", secureAlternative: "POP3S", description: "Allows an email application to download messages from a mail server." },
  { port: 123, protocol: "NTP", secureAlternative: "NTP with NTS", description: "Keeps the clocks on computers and network devices synchronized." },
  { port: 137, protocol: "NetBIOS Name", secureAlternative: "DNS", description: "Helps computers find other devices by their names on a network." },
  { port: 138, protocol: "NetBIOS Datagram", secureAlternative: "Modern SMB with encryption", description: "Allows devices to exchange messages over a local network." },
  { port: 139, protocol: "NetBIOS Session", secureAlternative: "SMB 3 with encryption", description: "Supports file sharing between computers using NetBIOS." },
  { port: 143, protocol: "IMAP", secureAlternative: "IMAPS", description: "Lets users access and manage emails stored on a server." },
  { port: 161, protocol: "SNMP", secureAlternative: "SNMPv3", description: "Allows administrators to monitor network devices." },
  { port: 162, protocol: "SNMP Trap", secureAlternative: "SNMPv3", description: "Allows network devices to send alerts when something happens." },
  { port: 389, protocol: "LDAP", secureAlternative: "LDAPS", description: "Used to look up users and other information in a directory." },
  { port: 443, protocol: "HTTPS", secureAlternative: "Already encrypted", description: "Used to access websites while encrypting the information being sent." },
  { port: 445, protocol: "SMB", secureAlternative: "SMB 3 with encryption", description: "Allows computers to share files and printers over a network." },
  { port: 465, protocol: "SMTPS", secureAlternative: "Already encrypted", description: "Used to send email through an encrypted connection." },
  { port: 636, protocol: "LDAPS", secureAlternative: "Already encrypted", description: "Allows directory information to be accessed through an encrypted connection." },
  { port: 3389, protocol: "RDP", secureAlternative: "RDP with TLS and NLA", description: "Lets someone access and control another computer's desktop remotely." }
];

