export const authcodeEmail = (data: { name: string; code: string }) =>
	template.replace("{{name}}", data.name).replace("{{code}}", data.code);

// Generated and designed with Enginemailer
const template = `<body class="body" style="background-color:#fff;margin:0;padding:0;-webkit-text-size-adjust:none;text-size-adjust:none">
  <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#fff">
    <tbody>
    <tr>
      <td>
      <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0">
        <tbody>
        <tr>
          <td>
          <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#f6f6f6;color:#000;width:700px;margin:0 auto" width="700">
            <tbody>
            <tr>
              <td class="column column-1" width="100%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-top:15px;vertical-align:top">
              <table class="text_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word">
                <tbody>
                <tr>
                  <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px">
                  <div style="font-family:sans-serif">
                    <div class="" style="font-size:12px;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;mso-line-height-alt:14.4px;color:#555;line-height:1.2">
                    <p style="margin:0;font-size:14px;text-align:center;mso-line-height-alt:16.8px"><strong><span style="word-break: break-word; font-size: 24px;">Assignee Authcode for You, {{name}}</span></strong></p>
                    </div>
                  </div>
                  </td>
                </tr>
                </tbody>
              </table>
              <table class="text_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word">
                <tbody>
                <tr>
                  <td class="pad" style="padding-bottom:20px;padding-left:30px;padding-right:30px;padding-top:10px">
                  <div style="font-family:sans-serif">
                    <div class="" style="font-size:12px;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;mso-line-height-alt:18px;color:#555;line-height:1.5">
                    <p style="margin:0;font-size:14px;text-align:center;mso-line-height-alt:21px">
                      Do not share this code with <em>anyone</em>. This OTP will expire in <strong>10</strong> minutes.
                    </p>
                    </div>
                  </div>
                  </td>
                </tr>
                </tbody>
              </table>
              </td>
            </tr>
            </tbody>
          </table>
          </td>
        </tr>
        </tbody>
      </table>
      <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0">
        <tbody>
        <tr>
          <td>
          <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;border-radius:0;color:#000;width:700px;margin:0 auto" width="700">
            <tbody>
            <tr>
              <td class="column column-1" width="100%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-bottom:5px;padding-top:5px;vertical-align:top">
              <table class="text_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word">
                <tbody>
                <tr>
                  <td class="pad">
                  <div style="font-family:sans-serif">
                    <div class="" style="font-size:14px;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;mso-line-height-alt:16.8px;color:#555;line-height:1.2">
                    <p style="margin:0;font-size:14px;text-align:center;mso-line-height-alt:16.8px"><strong><span style="word-break: break-word; font-size: 50px;">{{code}}</span></strong></p>
                    </div>
                  </div>
                  </td>
                </tr>
                </tbody>
              </table>
              </td>
            </tr>
            </tbody>
          </table>
          </td>
        </tr>
        </tbody>
      </table>
      <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0">
        <tbody>
        <tr>
          <td>
          <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;color:#000;width:700px;margin:0 auto" width="700">
            <tbody>
            <tr>
              <td class="column column-1" width="100%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-bottom:25px;vertical-align:top">
              <table class="text_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word">
                <tbody>
                <tr>
                  <td class="pad">
                  <div style="font-family:sans-serif">
                    <div class="" style="font-size:12px;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;mso-line-height-alt:14.4px;color:#555;line-height:1.2">
                    <p style="margin:0;font-size:14px;text-align:center;mso-line-height-alt:16.8px"><span style="word-break: break-word; font-size: 12px;"><strong>Our mailing address:</strong></span></p>
                    <p style="margin:0;font-size:14px;text-align:center;mso-line-height-alt:16.8px"><span style="word-break: break-word; font-size: 12px;">no-reply.assignee@outlook.com</span></p>
                    </div>
                  </div>
                  </td>
                </tr>
                </tbody>
              </table>
              </td>
            </tr>
            </tbody>
          </table>
          </td>
        </tr>
        </tbody>
      </table>
      </td>
    </tr>
    </tbody>
  </table>
</body>`;
