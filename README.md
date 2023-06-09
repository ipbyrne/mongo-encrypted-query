# Mongo Encrypted Query
[![CI](https://github.com/ipbyrne/mongo-encrypted-query/actions/workflows/ci.yml/badge.svg)](https://github.com/ipbyrne/mongo-encrypted-query/actions/workflows/ci.yml)
![Branches](./coverage/badge-branches.svg)
![Functions](./coverage/badge-functions.svg)
![Lines](./coverage/badge-lines.svg)
![Statements](./coverage/badge-statements.svg)
[![NPM](https://nodei.co/npm/@ipbyrne/mongo-encrypted-query.png?mini=true)](https://npmjs.org/package/@ipbyrne/mongo-encrypted-query)

This is a simple SDK that can be used to encrypt all of your data in MongoDB in a way that makes it searchable with any MongoDB equality operator by utilizing determinstic symmetric encryption. This acheived by using a `ECDH-ES+A256KW` private key along with the `AES-256-GCM` encryption algorithm.

## How To Use

This package is intended to be layed over any implementation using MongoDB by utilizing 3 functions whenever you are interacting into the database.

### Encrypt Data (`encryptData`)
Parameters:
- Data: This is the data you want to encrypt.
- Private Key JWK: This is the key you want to use for encryption.
- Enrypt Keys: This is a boolean flag you can set to control if the keys of the object should also be encrypted. This is `true` by default.

This function is to be used whenever you are saving data into the database. You are expected to pass into this function the data to be saved and the private key you are going to use to encrypt the data to make the data queryable.

When saving to MongoDB you are expected to pass in an object but it can encrypt any data you pass in (string, number, array, etc).

Once encrypted you can save the data as is, or under any key value like `data` or something similiar. If you do save the data under a key value, you MUST pass that key to the `encryptQuery` function in order for the query to work.

### Encrypt Query (`encryptQuery`)
Parameters:
- Query: This is a MongoDB query written as if the data was not encrypted.
- Private Key JWK: This is the key you used to encrypt the data you saved to MongoDB.
- Enrypt Keys: This is a boolean flag you can set to control if the keys of the object should also be encrypted. This is `true` by default.
- Prefix: This is the key the data is saved under. If you are saving the data to MongoDB as it comes out of `encryptData` you do not need to provide this parameter.

This function is to be used to format any query you want to use when querying the database. This function takes in the traditional MongoDB query, along with the private key used when saving the data you are trying to query.

As mentioned above, if you save your encrypted data under a specific key value (like `data`), you must pass this key to the `encryptQuery` function in order for the returned query to work.

### Decrypt Data (`decryptData`)
Parameters:
- Data: This is the encrypted data you are trying to decrypt.
- Private Key JWK: This is the key you used to encrypt the data you saved to MongoDB.
- Enrypt Keys: This is a boolean flag you can set to control if the keys of the object should also be encrypted. This is `true` by default.

This function is used to decrypt the data returned from MongoDB. This function is expecting the data returned from MongoDB, the private key you will use to decrypt the data.

This will then return the decrypted data.

### Generate Encryption Key (`generateEncryptionPrivateKey`)
This function is used to generate a `X25519` private key that can be used for encrypting and decrypting the data. This key should never be saved in source or the database and should be stored in a key service where they are accessed whenever you are encrypting/decrypting data.

## Working In The Repo

To run the test to see how this works in practice you can run:
```
npm install
npm run test
```

Out of the box, this will support all MongoDB equality query operators.

## How Data is Stored

Once data is added to the DB this will be it's shape:
```
{
  "7818": "640e9625f2d4c216e3786e36ad726f8e4445086202b8d0cda065b56c51704cfd9da8c7d75500cb88cbfd8ae328",
  "511f9771f3c4d306": [
    "79088c6ff49b845dae6a2b2ab92222d8040f15330ab8c5d6f226b625552608f2d1a1839e1b02",
    "79088c6ff49b845dae2e3560e07e7ed0591c486059ec9c9bf838ba3549670aaa"
  ],
  "6505887a": [
    "47198a76e1c8ca10b5781f76ab7569d902015b6d"
  ],
  "7f1d957a": "45198b6ba792",
  "75198b7cf5c8db06b07232": "54049972f7cdce529a6f3960ab7f78de17041a32",
  "780f8b6ae6cfc8179d7c2861": "234cc927aa91995feb290834fb2b3e8f4c580e5b",
  "720e9d7be2cfdf1bb8710f71ac7b69d402": {
    "7818": "75159c25e2d9ca1fa971393efc2238",
    "70189c6de2d2d8": {
      "6b15885ce8c5ce": "264bcb28be"
    },
    "7f198b6be2c5ea00ab7c2540af656d": [
      {
        "78129c7aff": "24"
      },
      {
        "78129c7aff": "27"
      },
      {
        "78129c7aff": "26"
      }
    ]
  },
  "780f8b6ae2d3": {
    "7818": "75159c25f0c4c948bc653d69be7d6999150757"
  }
}
```

In practice, each user or organization should use their own private key for encryption so no users will have matching encrypted values even if they are storing the same values.

These keys should never be comitted to source or saved in the database directly and ideally would be kept in a service like Google Secret Manager or another providers equivelant service. 

You would then retrieve the keys when encrypting and decrypting data.

The ones in the 'key.js' file are there so you can easily test and play with the repository to understand how everything works together.

## Optional Configurations

## Encrypting Keys
All keys are encrypted by default unless you set `encryptKeys` to `false` when using any of the operations in the package.

If you are not worried about the keys being readable in the database you can opt out of encrypting them. One benefit of doing this would be it will allow you to build indexes on fields to speed up queries.
