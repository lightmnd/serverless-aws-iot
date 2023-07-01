// "use strict";

const AWS = require("aws-sdk");
const cert = require("./cert");

module.exports.registerDevices = async (event) => {
  const s3 = AWS.S3(); // to store a copy of JSON file in our S3 bucket
  const iot = AWS.iot();
  const bucketName = "provisioning-data-devices";

  const devices = [
    { ThingName: "device001", SerialNumber: "AIR001", CSR: "csr1" },
    { ThingName: "device002", SerialNumber: "AIR002", CSR: "csr2" },
    { ThingName: "device003", SerialNumber: "AIR003", CSR: "csr3" },
  ];

  const bulkRequest = {
    templates: [],
  };

  for (const device of devices) {
    const params = {
      templateBody: JSON.stringify({
        Parameters: {
          SerialNumber: {
            Type: "String",
          },
          CertificateSigningRequest: {
            Type: "String",
          },
        },
        Resources: {
          thingResource: {
            Type: "AWS::IoT::Thing",
            Properties: {
              ThingName: {
                Ref: device.ThingName,
              },
              AttributePayload: {
                version: "v1",
                csr: {
                  Ref: device.CSR,
                },
              },
            },
          },
        },
        Outputs: {
          CertificatePem: {
            Value: {
              "Fn::Join": [
                "",
                [
                  "-----BEGIN CERTIFICATE-----\n",
                  "MIIDWTCCAkGgAwIBAgIUX1yL/Bu+taloTwKQtVj64ytplcEwDQYJKoZIhvcNAQELBQAwTTFLMEkGA1UECwxCQW1hem9uIFdlYiBTZXJ2aWNlcyBPPUFtYXpvbi5jb20gSW5jLiBMPVNlYXR0bGUgU1Q9V2FzaGluZ3RvbiBDPVVTMB4XDTIzMDYyNjA5NTc0NVoXDTQ5MTIzMTIzNTk1OVowHjEcMBoGA1UEAwwTQVdTIElvVCBDZXJ0aWZpY2F0ZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANImNmAAt2eTMn4rUyYMDnMg5WfkfyL5QLWgOcl23El2m1YGYK8/EJBbx11YRVQQ+BRPg0BugmTOO9ym85NOb6RYUbKfxLAd89JmzIXKu5VTPHltiYuZ0Pj2VxY4AfCLF975Sj64t8kKHWRA+2QAuklRInLDUGtHh6Ykk5+tDo90xI731FGGEBM7m91nrnyAYlaUIwfFiwHooF1v4Kv4FqwqSy4KL7gxNpFYiO5t67jyQaEyKKn65S57VFl3V9J3Nx3/REs0pFb/Q+DIs918AncaR1MREkRq8FvvNXlhRQhUQgDhXbEjPD2j/CCeTZS7wVOAP+5nQzNjeWLGsLFoPz8CAwEAAaNgMF4wHwYDVR0jBBgwFoAU7xVN0GNUG5xfMHLYE7KvRNSyAs8wHQYDVR0OBBYEFBK3Vzqdn90HWSOOeQuXW+9086zfMAwGA1UdEwEB/wQCMAAwDgYDVR0PAQH/BAQDAgeAMA0GCSqGSIb3DQEBCwUAA4IBAQAuPKJQJy6aOoFQNyzPG2bAzVhUMbjQH/2/FBBZGIqVjv6QfDtPy7DqncOAAZ23VUP45K0+8zEFHielj65MxDheoD1n8/WeVSsaz5kxlTM6ITsrk7eZqxwMYogWnOE3foG+G0iKc5/XNPPL5uoKHg//hB00OS6ehk8b41dymnypJONos68o3A/er7x9kvnE0Z7hTkH7UGuYUzyhHJLlaEG/wlF+XucgC0GDWVZAJ9gvT4n22G5GXnFlLJOFgdeZg+s1GtC7/VVQVD4ieRmwS03A1LZTLFRIuRU+S9mPXqxSaCMwUdfyKHtWDNG4gE2kOPqllp0pu7QzWQokUL6ZfAMj", // Replace with ENV variable (your certificate PEM)
                  "\n-----END CERTIFICATE-----\n",
                ],
              ],
            },
          },
        },
      }),
      enabled: true,
    };

    bulkRequest.templates.push(params);
  }

  try {
    const result = await iot
      .createProvisioningTemplateVersion(bulkRequest)
      .promise();
    console.log(
      `Bulk provisioni file created successfully - Version: ${result}`
    );

    const uploadToS3 = devices.map(async (device) => {
      const key = `file-${device.SerialNumber}.json`;

      const s3Param = {
        Bucket: bucketName,
        Key: key,
        Body: JSON.stringify(device),
        ContentType: "application/json",
      };

      await s3.putObject(s3Param).promise();
    });

    await Promise.all(uploadToS3);
  } catch (error) {
    console.error("Error creating bulk provisioning file:", error);
  }
};
