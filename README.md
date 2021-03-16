# User-Authentication-Node.js-Express.js
User Authentication REST API built using Node & Express. The REST API include User Login, User Register, Reset Password, storing Email Subscribers, Automatic emails & etc. You just simply clone the Repo, add your Database link, add your API keys, customise the API according to your requirements and start using the Rest API.

## Functionalities & Features 
* Login
* Register
* Reset Password
* Logout
* Email Subscriptions
* Automatic email on Register or Login


<!-- GETTING STARTED -->
## Getting Started

Below you can find the process of installation, prerequisites and more so you can get these User Authentication functionality developed in the matter of minutes.

### Prerequisites

Install the latest version of npm
  ```sh
  npm install npm@latest -g
  ```
Create a MongoDB Database (optional - or use Robo3T)
* Link - https://www.mongodb.com/

Create a SendGrid API Key
* Link - https://sendgrid.com/

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Rajsuthan/User-Authentication-Node.js-Express.js
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Update your Databse url in `.env`

   ```JS
   DATABASE='ENTER YOUR DB URL'
   ```
3. Update your SendGrid API key in `.env`

   ```JS
   SENDGRID_API_KEY='ENTER YOUR SENDGRID API KEY'
   ```
4. Add your SendGrid email in `emailsubscriber.js`

    ```JS
      exports.sendGridEmailResetPassword = (email, subject, message, code) => {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          to: email,
          from: "example@example.com", // Please use your Sendgrid email
          subject: subject,
          text: `${message}\n\n This is your verification code: ${code}`,
        };
        sgMail
          .send(msg)
          .then(() => {
            console.log("Email sent");
          })
          .catch((error) => {
            console.error(error);
          });
    };
       ```
3. Start the server
   ```sh
   npm start
   ```
## Environment variables

These environment variables will be used for configuring different services by default:
| Key                 | Default Value            | Description                                                                                         |
|---------------------|--------------------------|-----------------------------------------------------------------------------------------------------|
| `DATABASE` | `url`              | MongoDB Cluster URL                                                                                   |
| `SECRET` | `value`                  | Used for Creating unique tokens                                                                                  |
| `API_KEY` | `key`               | API Key for your Endpoint (can be anything)                                                                              
| `SENDGRID_API_KEY` | `key`               | Sendgrid API Key (for sending emails)                                                             

## Routes
| URL                             | Method | Description                                              | Content (Body)          |
|---------------------------------|:-----------:|----------------------------------------------------------|-------------------------|
| /api/signup              |     POST    | Registers a user and sends email verification            | `firstname` `lastname` `email` `password`        |
| /api/signin                 |     POST    | Login with existing user   | `email` `password`          |
| /api/sendverificationcode                |     PUT     | Send Verification code to change password  | `email` |
| /api/resetpassword        |     PUT    | Changes User's Password                    | `id` `verificationCode` `newPassword`  |
| /api/signout |     GET     | Signs out a User                    | None |
| /api/user/:userId              |     GET    | Retrieve the Single User | None |
| /api/user/:userId                    |     PUT     | Updates the Single User and returns user                   | `name` `email` `password`            |
| /api/user/:userId           |     DELETE    | Deletes the Single User       | None    |
| /api/users/:userId           |     GET    | Get all Users(only admin)       | None    |
| /api/emailsubscriber           |     POST    | Add the Email in the DB       | `email`    |
| /api/emailsubscribers/:userId          |     GET    | Get all Email Subscribers (only admin)       | None    |

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request




## License

Distributed under the MIT License. See `LICENSE` for more information.




## Contact

Rajsuthan Gopinath - [@rajsuthan_dev](https://twitter.com/your_username) - rajsuthan66@gmail.com

Portfolio - https://raj-dev.netlify.app/

Project Link: [https://github.com/Rajsuthan/User-Authentication-Node.js-Express.js](https://github.com/your_username/repo_name)
