# Changelog

## [0.24.4](https://github.com/michalgm/memoryhole/compare/v0.24.3...v0.24.4) (2025-11-10)

### Bug Fixes

* update dayjs timezone handling across components ([ec382cb](https://github.com/michalgm/memoryhole/commit/ec382cb37883e05dc1344692726301400c4a2349)), closes [#61](https://github.com/michalgm/memoryhole/issues/61)

## [0.24.3](https://github.com/michalgm/memoryhole/compare/v0.24.2...v0.24.3) (2025-10-26)

### Bug Fixes

* **UI:** fix icon import ([f4f5e36](https://github.com/michalgm/memoryhole/commit/f4f5e36c50815e34a146d6b929515bd0cb0680c2))

## [0.24.2](https://github.com/michalgm/memoryhole/compare/v0.24.1...v0.24.2) (2025-10-26)

### Bug Fixes

* fix broken babel deps ([a46c8be](https://github.com/michalgm/memoryhole/commit/a46c8bedf08c752199a903177f024ad24334c22e))

## [0.24.1](https://github.com/michalgm/memoryhole/compare/v0.24.0...v0.24.1) (2025-10-26)

### Bug Fixes

* **Form:** minor props fix ([e9b8655](https://github.com/michalgm/memoryhole/commit/e9b8655f997ef9ba9383ada5abfc38e5cd193832))
* **UI:** clean up admin page ([422d7e8](https://github.com/michalgm/memoryhole/commit/422d7e8ccacfa7a93fe56d9be9195e0f80f167a0))
* **UI:** disable CSV download on arrests page for roles < Coordinator ([221a33b](https://github.com/michalgm/memoryhole/commit/221a33b743ea9fed3a999d6728016b76b353a87f)), closes [#47](https://github.com/michalgm/memoryhole/issues/47)
* **UI:** Fix default route for expired logins ([89fd1ac](https://github.com/michalgm/memoryhole/commit/89fd1ac7dd1e16d403e9cbcb048ef9b85b093feb))

## [0.24.0](https://github.com/michalgm/memoryhole/compare/v0.23.0...v0.24.0) (2025-10-22)

### Features

* add ability to browse + create documents ([e1b8a32](https://github.com/michalgm/memoryhole/commit/e1b8a3251b763463426c95a2002ba21603b6a525))
* add collaberative action whiteboard ([adf187d](https://github.com/michalgm/memoryhole/commit/adf187df3e2637b9bc1e95f9575585ef94207982))
* **API:** enforce user access restrictions on actions based on start date ([eabc7e9](https://github.com/michalgm/memoryhole/commit/eabc7e9aae1480fb20dd660380342a30cbcdbacf)), closes [#29](https://github.com/michalgm/memoryhole/issues/29)
* **CollabEditor:** editor improvements ([26bef16](https://github.com/michalgm/memoryhole/commit/26bef161e46a5ab6c32baa6907757d673e62e536))
* implement document access restrictions + document title management ([2972ea5](https://github.com/michalgm/memoryhole/commit/2972ea53df95ff855c4526a76246e07a76e3c362))
* **UI:** Add collab editor improvements ([ef4daf6](https://github.com/michalgm/memoryhole/commit/ef4daf68cc65d3118e84eca55ab824a89b568fd3))

### Bug Fixes

* filter documents based on access role ([975c65d](https://github.com/michalgm/memoryhole/commit/975c65da9b44d0dc6cf0cdff0fb0292c546aae49))
* fix collab server port config ([88f957c](https://github.com/michalgm/memoryhole/commit/88f957c4abb8975aec5ca4a2c241fb34b7db4101))
* fix global filter behavior in table view (fixes [Bug] arrest table show-hide searchbar not working ([8e7c41f](https://github.com/michalgm/memoryhole/commit/8e7c41f5d2cf4af5eac2ea8cfe74130cf3a102d0)), closes [#48](https://github.com/michalgm/memoryhole/issues/48)
* more name format tweaks ([17f8ca7](https://github.com/michalgm/memoryhole/commit/17f8ca758629c436b23208173c0455a9fa394845))
* **UI:** allow clearing of user access date threshold ([efb3f9a](https://github.com/michalgm/memoryhole/commit/efb3f9ad603d947b6302f6a1629497ef3e23a175))
* **UI:** don't show whiteboard link on new action page ([90107ac](https://github.com/michalgm/memoryhole/commit/90107ac91fe793226e395e21507247f3d3f4f2b0))
* **UI:** fix date filtering functionality in DataTabkle ([a5f3cd1](https://github.com/michalgm/memoryhole/commit/a5f3cd1ad6b922c8c19a4030ef68db1da8658ddf)), closes [#13](https://github.com/michalgm/memoryhole/issues/13)

## [0.23.0](https://github.com/michalgm/memoryhole/compare/v0.22.0...v0.23.0) (2025-09-09)

### Features

* Add global timezone setting for consistent time display ([3efe700](https://github.com/michalgm/memoryhole/commit/3efe7008c1709a8e600a75d6a57fd933bfa7cdaf)), closes [#30](https://github.com/michalgm/memoryhole/issues/30)
* Add User profile page ([c0752ae](https://github.com/michalgm/memoryhole/commit/c0752ae34a5d72371f521cb157191d1df6864d67))
* **Logs:** Make 'Filter on current arrest' persist ([03a3203](https://github.com/michalgm/memoryhole/commit/03a320385d741db657a9e2e90720246f2ff1f83f)), closes [#26](https://github.com/michalgm/memoryhole/issues/26)
* **UI:** add buttons option to formSection ([5f4641d](https://github.com/michalgm/memoryhole/commit/5f4641d48ce8a5b0c58d25e9aa0c3ad4fd1c6925))
* **ui:** improve error display ([5096469](https://github.com/michalgm/memoryhole/commit/50964699a9a8c83540305290c669b96ca8382b19))
* Use AccountBox icon for arrests ([a65f24a](https://github.com/michalgm/memoryhole/commit/a65f24a9840cb48e83ec0f1a8d4d12d07e0b13b8))

### Bug Fixes

* **API:** fix log create issues ([27a6a81](https://github.com/michalgm/memoryhole/commit/27a6a8189b880e1855ee056ace801126f444f8f4))
* **API:** More arrestee name display fixes ([86d5364](https://github.com/michalgm/memoryhole/commit/86d5364ae77bd24f0d98a07a317c053c40b5ff02)), closes [#27](https://github.com/michalgm/memoryhole/issues/27) [#28](https://github.com/michalgm/memoryhole/issues/28)
* clean up errant console.log ([d11f90d](https://github.com/michalgm/memoryhole/commit/d11f90d9ce66790da6efd353c4e49d54629a3bf1))
* export bug ([e9a4b35](https://github.com/michalgm/memoryhole/commit/e9a4b355ef417099a53da25201c2d44b7461bf9e))
* **UI:** fix Rich text field label ([87614b2](https://github.com/michalgm/memoryhole/commit/87614b29b3cd10d473fc801d71c1a24108b8271b)), closes [#21](https://github.com/michalgm/memoryhole/issues/21)

## [0.22.0](https://github.com/michalgm/memoryhole/compare/v0.21.1...v0.22.0) (2025-09-07)

### Features

* add arrest meta fields ([f86c621](https://github.com/michalgm/memoryhole/commit/f86c621f54f4d2ae8dd09b8e73e9d4fc7357d30e)), closes [#7](https://github.com/michalgm/memoryhole/issues/7) [#9](https://github.com/michalgm/memoryhole/issues/9)
* Allow editing of log time ([02f17bb](https://github.com/michalgm/memoryhole/commit/02f17bb47d2a22d49db0993400cac5a624ee5781)), closes [#17](https://github.com/michalgm/memoryhole/issues/17)
* change name display behavior ([1bd79e2](https://github.com/michalgm/memoryhole/commit/1bd79e268a619f546058d69b05cbacf2abfac121)), closes [#8](https://github.com/michalgm/memoryhole/issues/8)
* Custody status behavior ([cc6d7dc](https://github.com/michalgm/memoryhole/commit/cc6d7dc75195e11098fbb5410dd2b980c90613d4)), closes [#20](https://github.com/michalgm/memoryhole/issues/20)

### Bug Fixes

* **api:** handle relation removal + better json updates ([b01eee6](https://github.com/michalgm/memoryhole/commit/b01eee6d848f812b2b1930b08de4e52d65360c02))
* **api:** update transformInput to handle action field more robustly ([e36946e](https://github.com/michalgm/memoryhole/commit/e36946ed688dd50b8c8f1563b4b55b18225680b4))
* Log relations access ([3e18ecd](https://github.com/michalgm/memoryhole/commit/3e18ecde5c7f07803b53c4e897a099b7e63d6cc2))

## [0.21.1](https://github.com/michalgm/memoryhole/compare/v0.21.0...v0.21.1) (2025-09-06)

### Features

* expand access restrictions ([310f900](https://github.com/michalgm/memoryhole/commit/310f900e8dc1430e8c6ff834db9a506bf57905db))

## [0.21.0](https://github.com/michalgm/memoryhole/compare/v0.19.1...v0.21.0) (2025-09-06)

### Features

* add CompositeIcon component ([a46c583](https://github.com/michalgm/memoryhole/commit/a46c58376a86506f4fa4f729d2d7e4ee11959e5a))
* add info color for form inputs ([9c94943](https://github.com/michalgm/memoryhole/commit/9c94943651121a14b7a05ed670a9cb5b4bf58a6c))
* add mergeArrests service method to combine arrest records and preserve logs ([6b0c315](https://github.com/michalgm/memoryhole/commit/6b0c3156bb0da4f28e0774c16ae45d289db8353b))
* add mulit-select for actions in users page ([807402a](https://github.com/michalgm/memoryhole/commit/807402a76b43fa7240123d7d114e81c7d5437b97))
* **api:** export data validation checks via prepareUpdate method ([9c01bc8](https://github.com/michalgm/memoryhole/commit/9c01bc88084c404f22722d54dacc18cbc601660c))
* Implement ignored duplicate arrests functionality ([2875748](https://github.com/michalgm/memoryhole/commit/2875748c6662a80f87f8f8c7df13738cf68a972f))
* implement merge arrests functionality with confirmation dialog ([fdd42fc](https://github.com/michalgm/memoryhole/commit/fdd42fcec12d215115144014047127c1b887c53e))
* refine duplicate arrest scoring and add comprehensive test scenarios ([de8a0e0](https://github.com/michalgm/memoryhole/commit/de8a0e056d1f18f74629b1b26fb6411535c84ee1))
* **Schema:** Rename 'User' user role to 'Operator' - Fixes [#11](https://github.com/michalgm/memoryhole/issues/11) ([8820ae6](https://github.com/michalgm/memoryhole/commit/8820ae6d4a1898fe380b4b368236e6e8ea4bac2e))
* Show duplicate arrest matches as groups of rows on duplicateArrests page ([69ea09f](https://github.com/michalgm/memoryhole/commit/69ea09f02ead4fa8861e76904c88d1ec8ec45cd4))
* **UI:** Add disableCollapse param to FormSection ([8741e7d](https://github.com/michalgm/memoryhole/commit/8741e7d8d6eb4fc68d1469de70a1f33cf4f09e98))
* **UI:** Docket sheet search fixes ([58cd780](https://github.com/michalgm/memoryhole/commit/58cd7805d27af22ca2b7c59e5b417b268b2e80fd)), closes [#16](https://github.com/michalgm/memoryhole/issues/16)
* **UI:** FIrst Pass at arrest comparison UI ([2a3dbba](https://github.com/michalgm/memoryhole/commit/2a3dbba8919d43a2146f41f34e9124882d8e02cb)), closes [#15](https://github.com/michalgm/memoryhole/issues/15)

### Bug Fixes

* add ignorePatterns to eslintConfig for better linting control ([d3797bd](https://github.com/michalgm/memoryhole/commit/d3797bd9c90b8dd94b179ed2dab93605fdb0d823))
* allow target attribute in Link component to handle external links ([3565539](https://github.com/michalgm/memoryhole/commit/3565539d82a057c28e1c6fbb8ed8f1deeb7291c1))
* **api:** add strict filter on max arrest diff ([32148b6](https://github.com/michalgm/memoryhole/commit/32148b6b7d79a1f4b0acbbf5aa5d06cc3c609db6))
* **api:** convert arrestee dob to date from datetime ([cc4456e](https://github.com/michalgm/memoryhole/commit/cc4456e55748f9e58da345fb891eccc3f728b2e4))
* **api:** enforce data vaildity checks on arrestAccess ([e85f180](https://github.com/michalgm/memoryhole/commit/e85f1805533a8d37b3a8bc5edd9d8c912218c478))
* **api:** fix user email validation bug ([24ce140](https://github.com/michalgm/memoryhole/commit/24ce140f5a67a2a38c04f2dd20f0c01d79521198))
* **api:** Increase transaction timeout + pass db instance to validation ([e01caaa](https://github.com/michalgm/memoryhole/commit/e01caaaa350c468c08adb771d2cd5c0bd1e970b2))
* Correct punctuation in multi-line text field description ([f38d46e](https://github.com/michalgm/memoryhole/commit/f38d46e1c2bb98c83b863386e994aaf43538ff16))
* enhance column definition handling in DataTable component ([45e247a](https://github.com/michalgm/memoryhole/commit/45e247a868e80edec01eabcbee7a58b6245a9017))
* enhance layout of ModInfo and CompareForm components for better responsiveness ([2193ff9](https://github.com/michalgm/memoryhole/commit/2193ff966b598cd6c4793ae780c808115c59b240))
* Ensure getSetting returns an empty object if key is not found in settingsCache ([7dca525](https://github.com/michalgm/memoryhole/commit/7dca52558737e0dc2fd116d58da7b2ed64c94278))
* ensure initial state is set for tableProps and handle refetch reloading state ([fa3da99](https://github.com/michalgm/memoryhole/commit/fa3da9965f1b15177930fd7403a904c79f161fde))
* hide label on action search ([eba46fb](https://github.com/michalgm/memoryhole/commit/eba46fb565e74a142cfb5f5c98ec76ed3c81073e))
* include meta fields (updated, created) on duplicate results ([e7861eb](https://github.com/michalgm/memoryhole/commit/e7861eb5b91de8a46e5b0863165ed4a31a40147f))
* **NavBar:** correct environment variable access for version and build timestamp ([c248995](https://github.com/michalgm/memoryhole/commit/c24899570173caaa237fd4d71ce2e4fca0268b1e))
* **NavBar:** improve version and build timestamp display with fallback values ([e1fc383](https://github.com/michalgm/memoryhole/commit/e1fc383111d63df006d1831690c0fa4c64973e96))
* **Routes:** update route components for arrest comparison and duplicates ([1e6be9d](https://github.com/michalgm/memoryhole/commit/1e6be9d6848b147eb6603eaf8be6700c740d3534))
* simplify snackbar message on entity creation ([773c893](https://github.com/michalgm/memoryhole/commit/773c89339dde2750ebb7b89e887e4bdac402ac61))
* standardize dayjs implementation across app ([ea029f7](https://github.com/michalgm/memoryhole/commit/ea029f7a0b8fb780a2f5fa27f0d09100d2694bab))
* **ui:** properly parse dates as UTC ([aef3118](https://github.com/michalgm/memoryhole/commit/aef3118ac1fee30059424d8bd5cf327a0f7dfdb2))
* update Autocomplete and BaseField components to improve label handling and option formatting ([3ac6e1d](https://github.com/michalgm/memoryhole/commit/3ac6e1da2a2ba85c2b62395d5f8373d7bc03ede9))
* update condition for rendering delete button in Footer component ([fc20421](https://github.com/michalgm/memoryhole/commit/fc204212a933ca5d83ca76bab0e2d2920153ebfd))
* Update user references to operator in site settings and related migration ([f7d5282](https://github.com/michalgm/memoryhole/commit/f7d5282407406a03b1855e77bf51e64d223e7f69))
* **useFormManager:** pass formState.isDirty to resetForm for improved state handling ([09e012f](https://github.com/michalgm/memoryhole/commit/09e012fb71a34f7cdff482cfd6d508d179ece2fb))
* **vite.config:** correct environment variable definitions for build timestamp and app version ([41fc4a3](https://github.com/michalgm/memoryhole/commit/41fc4a38d7d98ba7823a8f3ab245bd71b02031b4))
* **vite.config:** remove unnecessary semicolon in version import ([e37119b](https://github.com/michalgm/memoryhole/commit/e37119b0d2a378fd4081ab4dc16b02b00411c0a9))

## [0.20.0](https://github.com/michalgm/memoryhole/compare/v0.19.1...v0.20.0) (2025-09-05)

### Features

* add CompositeIcon component ([e84bee9](https://github.com/michalgm/memoryhole/commit/e84bee98ce5a0e3c4c9648a7ecc0ebb6223a3341))
* add info color for form inputs ([ab4f81e](https://github.com/michalgm/memoryhole/commit/ab4f81e2727dd1100027915cf4a13a5849a2c12f))
* add mergeArrests service method to combine arrest records and preserve logs ([3564bb3](https://github.com/michalgm/memoryhole/commit/3564bb3d6bff9be6c8d5b22c56771fa87fbe7ac2))
* add mulit-select for actions in users page ([930a19b](https://github.com/michalgm/memoryhole/commit/930a19bb350d26fe9ce68352e72b7fb685de91b5))
* **api:** export data validation checks via prepareUpdate method ([0d5dbd0](https://github.com/michalgm/memoryhole/commit/0d5dbd0162af4e31510768998aeff4fedcf25c9e))
* Implement ignored duplicate arrests functionality ([59d0565](https://github.com/michalgm/memoryhole/commit/59d05655660aadbdfdc8eff55a2ca5b9141df812))
* implement merge arrests functionality with confirmation dialog ([2377a0a](https://github.com/michalgm/memoryhole/commit/2377a0a726020baeacfac38b2ce788796a711946))
* refine duplicate arrest scoring and add comprehensive test scenarios ([f5d0854](https://github.com/michalgm/memoryhole/commit/f5d085406dad6706a3b984ca9169ce70c5c32377))
* **Schema:** Rename 'User' user role to 'Operator' - Fixes [#11](https://github.com/michalgm/memoryhole/issues/11) ([8820ae6](https://github.com/michalgm/memoryhole/commit/8820ae6d4a1898fe380b4b368236e6e8ea4bac2e))
* Show duplicate arrest matches as groups of rows on duplicateArrests page ([ac05801](https://github.com/michalgm/memoryhole/commit/ac05801aa2c37b330c24beb7818c5b3f7412d76e))
* **UI:** Add disableCollapse param to FormSection ([8741e7d](https://github.com/michalgm/memoryhole/commit/8741e7d8d6eb4fc68d1469de70a1f33cf4f09e98))
* **UI:** Docket sheet search fixes ([58cd780](https://github.com/michalgm/memoryhole/commit/58cd7805d27af22ca2b7c59e5b417b268b2e80fd)), closes [#16](https://github.com/michalgm/memoryhole/issues/16)
* **UI:** FIrst Pass at arrest comparison UI ([2078716](https://github.com/michalgm/memoryhole/commit/2078716e6f4a961ed511facbc988a65eb5e721d6)), closes [#15](https://github.com/michalgm/memoryhole/issues/15)

### Bug Fixes

* add ignorePatterns to eslintConfig for better linting control ([dae8e3d](https://github.com/michalgm/memoryhole/commit/dae8e3decdf382b6fca26691cca34782dc4d405a))
* allow target attribute in Link component to handle external links ([35a4a50](https://github.com/michalgm/memoryhole/commit/35a4a503c6df0132fd4ac487ff8190a06598e360))
* **api:** enforce data vaildity checks on arrestAccess ([0c9774d](https://github.com/michalgm/memoryhole/commit/0c9774d667b85ce1fa65b1fc9d8f6f93e4d13a5a))
* Correct punctuation in multi-line text field description ([a5f4eb7](https://github.com/michalgm/memoryhole/commit/a5f4eb74b63972027a6f72fb15747039cd00a046))
* enhance column definition handling in DataTable component ([47f3dec](https://github.com/michalgm/memoryhole/commit/47f3dec491a2234d19211412c6b8a9d83db54e58))
* enhance layout of ModInfo and CompareForm components for better responsiveness ([b581c99](https://github.com/michalgm/memoryhole/commit/b581c990a19736056df4c79b4daf4c102d43d438))
* Ensure getSetting returns an empty object if key is not found in settingsCache ([63b109a](https://github.com/michalgm/memoryhole/commit/63b109a950d6a2cc11cfde632109403c93cead9e))
* ensure initial state is set for tableProps and handle refetch reloading state ([73e434e](https://github.com/michalgm/memoryhole/commit/73e434e22610fa2330630c02f45d72289de03cfc))
* hide label on action search ([977cde8](https://github.com/michalgm/memoryhole/commit/977cde898d3df00b1788c9f870d137717a388088))
* **NavBar:** correct environment variable access for version and build timestamp ([bf31e9d](https://github.com/michalgm/memoryhole/commit/bf31e9d0eb37cb8f51775da271d4231866fc8738))
* **NavBar:** improve version and build timestamp display with fallback values ([1480f31](https://github.com/michalgm/memoryhole/commit/1480f31a8c65505a092a90a743ff2fd91894aa6f))
* **Routes:** update route components for arrest comparison and duplicates ([db0eee7](https://github.com/michalgm/memoryhole/commit/db0eee72447874188d980ceaa6598c152f6ff58a))
* simplify snackbar message on entity creation ([2f4cdb1](https://github.com/michalgm/memoryhole/commit/2f4cdb142159d90d1794332181df1a9b1f146f52))
* update Autocomplete and BaseField components to improve label handling and option formatting ([3778baa](https://github.com/michalgm/memoryhole/commit/3778baa2b76ec698709ce5198b1dc3f1c39df4c1))
* update condition for rendering delete button in Footer component ([3b6c6c3](https://github.com/michalgm/memoryhole/commit/3b6c6c3c8d4e6c5a89263bd110084c6cf4774bf1))
* Update user references to operator in site settings and related migration ([8b79373](https://github.com/michalgm/memoryhole/commit/8b79373284b1545a62e419b752762735c9a3be8c))
* **useFormManager:** pass formState.isDirty to resetForm for improved state handling ([11e6bb7](https://github.com/michalgm/memoryhole/commit/11e6bb7d487f8f2142c80684026e05c237dc8bd6))
* **vite.config:** correct environment variable definitions for build timestamp and app version ([094875e](https://github.com/michalgm/memoryhole/commit/094875edaa4eb8d2f0ab484a2a3a6df4b56737ea))
* **vite.config:** remove unnecessary semicolon in version import ([34d00df](https://github.com/michalgm/memoryhole/commit/34d00dfdfa9446819039d7edbca53a19ec7f2bdc))

## [0.19.1](https://github.com/michalgm/memoryhole/compare/v0.19.0...v0.19.1) (2025-07-09)

### Bug Fixes

* update script path for production and staging environments ([49294d9](https://github.com/michalgm/memoryhole/commit/49294d9f50a084d1a5d762f34726497449a3aef3))

### Reverts

* Revert "update deps" ([9fabd07](https://github.com/michalgm/memoryhole/commit/9fabd0715988b3efd8b659884080b76204f90501))

## [0.19.0](https://github.com/michalgm/memoryhole/compare/v0.18.1...v0.19.0) (2025-07-09)

### Features

* implement JSONB field handling for arrests and arrestees, including bulk updates ([8a6f89e](https://github.com/michalgm/memoryhole/commit/8a6f89eb70bdf0a14bc650165c418bb6a8e532d1))

### Bug Fixes

* **API:** fix logs bug ([3a5eec8](https://github.com/michalgm/memoryhole/commit/3a5eec8581c83d59d9178aa9531354bfb00242ba))
* validate next court date and enhance test scenarios for arrest functionalities ([3843845](https://github.com/michalgm/memoryhole/commit/38438457682ee9ab42f5bdc1470686f52a87312a))

## [0.18.1](https://github.com/michalgm/memoryhole/compare/v0.18.0...v0.18.1) (2025-06-23)

## [0.18.0](https://github.com/michalgm/memoryhole/compare/v0.17.0...v0.18.0) (2025-06-23)

### Features

* **UI:** shift summary improvements ([11cf86f](https://github.com/michalgm/memoryhole/commit/11cf86f0ad7afccac61ff646fde5f795488c64a9))

### Bug Fixes

* **API:** Fixes role-checking to handle both role and roles properties ([79c5a7c](https://github.com/michalgm/memoryhole/commit/79c5a7c7325214629fc00f8ecdb9c2dcf09cbeaa))
* **UI:** handle race condition on user page ([27cb23c](https://github.com/michalgm/memoryhole/commit/27cb23cd08f4b3e0ff660d3bd97b6c80f0dda8a4))

## [0.17.0](https://github.com/michalgm/memoryhole/compare/v0.16.0...v0.17.0) (2025-01-25)

### Features

* **API:** enforce user role hierachy (users cannot modify/create/delete roles higher than their own) ([5ebf9d1](https://github.com/michalgm/memoryhole/commit/5ebf9d1f763c8ac32f75c0c93b3ec5ae0bf14ff4))

## [0.16.0](https://github.com/michalgm/memoryhole/compare/v0.15.0...v0.16.0) (2025-01-25)

### Features

* **Form:** Add icon to switch component - clean up checkboxgroup ([2455b49](https://github.com/michalgm/memoryhole/commit/2455b49926e755ea2b26de668afd768c699fd0c6))
* **Form:** Disable submit buttons when no fields have changed ([a50e06a](https://github.com/michalgm/memoryhole/commit/a50e06a5f0bed831d8b5f584f6b4c6d271bda061))
* **UI:** Add checkbox on Action delete to delete related arrests and logs ([e190cb0](https://github.com/michalgm/memoryhole/commit/e190cb0f8c841d20c031453bc84dd8aca3fcbb15))
* **UI:** add seperator on siteSettings page ([36f500e](https://github.com/michalgm/memoryhole/commit/36f500eced5c974f461a337606fdda1e23d8ae36))

### Bug Fixes

* **Form:** Clear blank <p> tag in rich text editor to catch blank/required entries ([a3c16dd](https://github.com/michalgm/memoryhole/commit/a3c16dde664927f93df534b1dd386755d3135fe2))
* **Form:** don't show "no changes" tooltip on loading ([d5d52d0](https://github.com/michalgm/memoryhole/commit/d5d52d0be6b8d1e0bcbd43891c589b7a744bb037))
* **Tests:** minor tests fixes ([13042bc](https://github.com/michalgm/memoryhole/commit/13042bcf6c294e3bf15b732d0a2ca7aedc7c9222))
* **UI:** some logs form fixes ([2032f5e](https://github.com/michalgm/memoryhole/commit/2032f5e367cc5b2eadd111e39e41080c00939caf))

## [0.15.0](https://github.com/michalgm/memoryhole/compare/v0.14.2...v0.15.0) (2025-01-22)

### Features

* **Form:** Logs improvements ([9d45db5](https://github.com/michalgm/memoryhole/commit/9d45db5be117a571b506a8018db2400058220968))
* **UI:** Add Infinite scroll loader for logs ([4a0f05a](https://github.com/michalgm/memoryhole/commit/4a0f05a4c363c8ccb2ba85da472b267572657ac4))
* **UI:** cleanup formSection, add small variant ([b25b10d](https://github.com/michalgm/memoryhole/commit/b25b10d07fa881b9772af94fc74eb327faf55555))

### Bug Fixes

* **DataTable:** CSV export Improvements ([05862f5](https://github.com/michalgm/memoryhole/commit/05862f5423d65cdee953c59fe9c7f6a0c46e4439))
* **Form:** simplify formmanager dirty detection ([2ea1338](https://github.com/michalgm/memoryhole/commit/2ea1338221ac3017cb83f9af8faf3d3b229a24b4))
* **UI:** Clean up documentation TOC ([e24c53b](https://github.com/michalgm/memoryhole/commit/e24c53bf43c689328adbf26bec809b7daf4df3fe))
* **UI:** UI tweaks ([c5a7781](https://github.com/michalgm/memoryhole/commit/c5a7781ab9ae9b00d977334be67eeb45767ca76b))

## [0.14.2](https://github.com/michalgm/memoryhole/compare/v0.14.1...v0.14.2) (2025-01-02)

### Bug Fixes

* **import_script:** fix email handler on intake errors ([ac87422](https://github.com/michalgm/memoryhole/commit/ac874227f4a55ddf3bc19333e334688301557bb7))

## [0.14.1](https://github.com/michalgm/memoryhole/compare/v0.14.0...v0.14.1) (2025-01-02)

### Bug Fixes

* fix package dependency issue ([2b0e74b](https://github.com/michalgm/memoryhole/commit/2b0e74b2c140a0215334999d45be87f8e14a5819))

## [0.14.0](https://github.com/michalgm/memoryhole/compare/v0.13.0...v0.14.0) (2025-01-02)

### Features

* **API:** allow coordinators to manage users ([c802abb](https://github.com/michalgm/memoryhole/commit/c802abb2b4ade38c8c38801af545640f23ef4acb))
* **import_script:** send email on import failure ([65aa9a8](https://github.com/michalgm/memoryhole/commit/65aa9a8511606614754299056c30d570e9b0b75d))
* **Tests:** add tools to generate mocks from schema ([e8df6d0](https://github.com/michalgm/memoryhole/commit/e8df6d0302c76cd33f10603d36b901d7289bae12))

### Bug Fixes

* **Form:** improve label id on rich text ([ac00a5e](https://github.com/michalgm/memoryhole/commit/ac00a5ef15d5c489af48e2333a65ad45278cc07a))
* **UI:** Include Admin link for coordinators ([f86d506](https://github.com/michalgm/memoryhole/commit/f86d506ca114ea5222c5d25633f357aa5250ab9b))

## [0.13.0](https://github.com/michalgm/memoryhole/compare/v0.12.0...v0.13.0) (2024-12-30)

### Features

* **API:** Add settingsCache and improve settings schema validation ([292d257](https://github.com/michalgm/memoryhole/commit/292d257ae290f042c1083d8ef42ae4f92ca2ce57))
* **API:** add User arrest_date_threshold field ([e875164](https://github.com/michalgm/memoryhole/commit/e8751644c0f99dfe3485902187bb3b7e93bc3c96))
* **API:** enable arrest_date_threshold restrictions to arrest service + add lots of tests ([6448e04](https://github.com/michalgm/memoryhole/commit/6448e04ec8dbde16feb3f0e5bd994c59ab668bd9))
* **Form:** Add ToggleButton and Switch fields ([dc3dc4d](https://github.com/michalgm/memoryhole/commit/dc3dc4d615c53389ba318003042888d5ff306f03))
* **Form:** Allow passing layout + fieldProps to formContainer ([83c3ad8](https://github.com/michalgm/memoryhole/commit/83c3ad81539f3a7a93ae9fa3fdf402e3de92282f))
* **UI:** Add SiteSettings admin Page, allow editing of default restrictions ([1e7c6c4](https://github.com/michalgm/memoryhole/commit/1e7c6c45ecbcf0dc945a660c15279c3cbbd13c78))
* **UI:** Enable configurable restriction defaults in User edit page ([b99a51d](https://github.com/michalgm/memoryhole/commit/b99a51d90931676fc1378f91fbd6d9025c518623))
* **UI:** switch shortcuts to use alt-[a|l] vs ctrl to avoid conflicts ([6f7fa6f](https://github.com/michalgm/memoryhole/commit/6f7fa6f62e8ffa3c33118665a4233fed6d77a541))

### Bug Fixes

* **deployment:** Clean up docker compose + db init ([fdf60a3](https://github.com/michalgm/memoryhole/commit/fdf60a3b10789350d08741392bff867bfbaa9bfe))
* **Form:** Allow autocomplete fields to be disabled ([5b1038a](https://github.com/michalgm/memoryhole/commit/5b1038a7e8faa4520452fb00beab8d0bdde6732e))
* **Form:** Allow type=number fields to be null ([930abe8](https://github.com/michalgm/memoryhole/commit/930abe8d25958193e0a31913f37d2cbbed34a4f1))
* **Form:** There should ne no need to update the form data outside of the defaultValues init ([c592f79](https://github.com/michalgm/memoryhole/commit/c592f792658906ae8965eedc1cfb152eafad34d8))

## [0.12.0](https://github.com/michalgm/memoryhole/compare/v0.11.0...v0.12.0) (2024-12-22)

### Features

* **UI:** Add interface to edit site help ([ab7d704](https://github.com/michalgm/memoryhole/commit/ab7d7044252741efad4fca2384b603c1c81ff4f8))
* **UI:** Allow Form Footer to be imported independant of formContainer ([a487368](https://github.com/michalgm/memoryhole/commit/a487368b093d665b37da4807ccced44753e07787))

### Bug Fixes

* **API:** lock down search queries ([5f779c8](https://github.com/michalgm/memoryhole/commit/5f779c80b02d750266b26aeb378c0d0e12644407))
* **Form:** fix bug w/ richtexteditor text-align ([b170324](https://github.com/michalgm/memoryhole/commit/b17032461feb753310b18ed884ab52818ffa9f3f))

### Reverts

* revert prerenders - was causing issues ([7d56af4](https://github.com/michalgm/memoryhole/commit/7d56af4e8e3fa3916596fd369571037de3b77854))

## [0.11.0](https://github.com/michalgm/memoryhole/compare/v0.10.0...v0.11.0) (2024-12-20)

### Features

* **UI:** Pre-render login + password pages ([444ea73](https://github.com/michalgm/memoryhole/commit/444ea733dd0513db169e1835f3078f73236ff747))
* **UI:** Upgraded to Material UI version 6 ([2bbcf8f](https://github.com/michalgm/memoryhole/commit/2bbcf8f5144d28ae6e058d5551bf1ccead0c7601))

## [0.10.0](https://github.com/michalgm/memoryhole/compare/v0.9.0...v0.10.0) (2024-12-19)

### Features

* **UI:** Upgraded to Material UI version 6 ([bff1521](https://github.com/michalgm/memoryhole/commit/bff152171957bbd84c52a862aa84e31f9e8fbd5a))

## [0.9.0](https://github.com/michalgm/memoryhole/compare/v0.8.0...v0.9.0) (2024-12-19)

### Features

* **API:** Add global arrest filter to ensure access restrictions are enforced even through related queries ([f046ae9](https://github.com/michalgm/memoryhole/commit/f046ae9be11911d23705934aca77fd225e8b5111))

### Bug Fixes

* **API:** lock down arrestees access via api ([c900798](https://github.com/michalgm/memoryhole/commit/c90079805b84059578bc81f3cbf57056f9872bf0))
* **API:** Make sure to delete arrestee when deleting arrest (+ tests) ([51c4a9c](https://github.com/michalgm/memoryhole/commit/51c4a9cd5af2a9a1e15a8426a296a1504eb32bac))
* **Form:** fix some bugs w/ update/mod time in footer ([d1f0795](https://github.com/michalgm/memoryhole/commit/d1f0795cf5f51884a62d87e8c01e027943d9758d))

## [0.8.0](https://github.com/michalgm/memoryhole/compare/v0.7.0...v0.8.0) (2024-12-18)

### Features

* **UI:** Add useContainerWidth hook for responsiveness ([64cd61d](https://github.com/michalgm/memoryhole/commit/64cd61d42812e84ae901874e0c9d91fd7064d3eb))
* **UI:** Better responsive layouts for narrow viewports ([0ac31ca](https://github.com/michalgm/memoryhole/commit/0ac31ca78c1e9e4901548e7305d4ff275d607521))
* **UI:** CTRL-A to quickly create a new arrest ([cc5c0e3](https://github.com/michalgm/memoryhole/commit/cc5c0e3ed61b712e5478a211c921e2835b49a0ee))
* **UI:** Persist new log input after cloing pane ([d1f227e](https://github.com/michalgm/memoryhole/commit/d1f227e7c69fc2fe5552037a90c673b54195e9ca))
* **UI:** some minor fixes ([e0c9709](https://github.com/michalgm/memoryhole/commit/e0c9709e6ccf5b711d1d0f8189e0f99bf9bf2809))
* **UI:** Theme updates - xsmall buttons + inputs, persistent success colors ([5ec5f1f](https://github.com/michalgm/memoryhole/commit/5ec5f1f79d54b696bd7576510c08907a36836cc6))

### Bug Fixes

* **DataTable:** Clean up datatable display ([a75db93](https://github.com/michalgm/memoryhole/commit/a75db9381deedcf4db437a7141310dafd6eddc99))
* **Form:** Force form reset on id change ([b7b187c](https://github.com/michalgm/memoryhole/commit/b7b187ca253bb9643d9def5a7990a3d79ec7df32))
* **UI:** fix logs form sidebar behavior ([8bfd369](https://github.com/michalgm/memoryhole/commit/8bfd3692a17e7418aaad8d6b7ea743d6e63ad7ff))
* **UI:** Layout improvements ([b463492](https://github.com/michalgm/memoryhole/commit/b463492bb9e28a2676183fa8e64eed9de883a341))
* **UI:** z-index on nav panel ([e7da567](https://github.com/michalgm/memoryhole/commit/e7da5671b193f2d10d6e58b2eed126288f905186))

## [0.7.0](https://github.com/michalgm/memoryhole/compare/v0.6.0...v0.7.0) (2024-12-15)

### Features

* **Form:** Set color to success on dirty form fields ([956f5e7](https://github.com/michalgm/memoryhole/commit/956f5e78dfc5dfea8561cc42c7d1d5334727de2a))
* **UI:** add ability to skip dirty form check on nav, and use it for logs in sidebar mode ([bcba173](https://github.com/michalgm/memoryhole/commit/bcba173252656fbde65b9cb634a74708e4ea99a8))
* **UI:** Add dark/light modle toggle UI ([3be78a5](https://github.com/michalgm/memoryhole/commit/3be78a5aef4e1d7f3875ea7408905fe26af27ee0))
* **UI:** Add extra-small buttons + inputs, and persist success color on form fields ([a64adab](https://github.com/michalgm/memoryhole/commit/a64adabee3748de1455fdc558c01ba073cf608ea))
* **UI:** use extra-small size for logs filter UI buttons + input ([0767cf9](https://github.com/michalgm/memoryhole/commit/0767cf9e8b6104072dae22f12d783d8c87a9db2e))

### Bug Fixes

* better message on dirty form navigation warning ([401ed44](https://github.com/michalgm/memoryhole/commit/401ed445047def084b84ee957bd3c069f6616914))
* **DataTable:** fix table striping colors ([e174a25](https://github.com/michalgm/memoryhole/commit/e174a2533d862d1ee8cbc8f4a5c5e76ff54b016b))
* **UI:** fix color + padding on Breadcrumbs ([60f625c](https://github.com/michalgm/memoryhole/commit/60f625c62a4e0567d4c7c88999bf2e2dd9910588))
* **UI:** fix logs pane overlapping table views ([e17e4b6](https://github.com/michalgm/memoryhole/commit/e17e4b6a40458dc48b180b4e9a98e43f59dace23))

## [0.6.0](https://github.com/michalgm/memoryhole/compare/v0.5.0...v0.6.0) (2024-12-14)

### Features

* **UI:** action should not be required on logs ([d5ede09](https://github.com/michalgm/memoryhole/commit/d5ede09dfb71d58395eef3958b5c584b5e989a26))
* **UI:** change logs toggle button color ([45e8d8f](https://github.com/michalgm/memoryhole/commit/45e8d8ff93e202eee48ef0d6be4eed3c0267dd6d))
* **UI:** Log Form - add Link action and Link Arrest buttons ([d8b84ea](https://github.com/michalgm/memoryhole/commit/d8b84ea7461c1ebfb8bb76b19991d757a460ca48))
* **UI:** Logs filters - add toggles for filtering by current action/arrest/user ([4b9d0b1](https://github.com/michalgm/memoryhole/commit/4b9d0b1b8ada19874b0e7e9acd04e974ed282195))

### Bug Fixes

* **API:** fix bug where legal_name_confidential was always getting returned as false ([48b0190](https://github.com/michalgm/memoryhole/commit/48b019065959ad8a1e18940908626fa9835b958b))
* **Form:** don't unneccesarily refetch blank forms ([0a1b328](https://github.com/michalgm/memoryhole/commit/0a1b32857a6691fea03b0bb4fafe6757b02bf664))
* **Form:** fix form section margins ([5d749dc](https://github.com/michalgm/memoryhole/commit/5d749dcb9c8d77190d815fa5d20d7a9aac1379de))
* **Form:** handle array values better ([db9df70](https://github.com/michalgm/memoryhole/commit/db9df7062afc8ab5a2164f885928607e9c23233e))

## [0.5.0](https://github.com/michalgm/memoryhole/compare/v0.4.1...v0.5.0) (2024-12-14)

### Features

* **Form:** Convert form footer, breadcrumb row, and form section headers to use sticky ([2b496a5](https://github.com/michalgm/memoryhole/commit/2b496a5651e6ad3b688ef6c8745e64a9deba0a53))
* **UI:** Add confirmation on signout ([f3124d2](https://github.com/michalgm/memoryhole/commit/f3124d229b55606a9f96b21c581bedb01cf1baed))
* **UI:** Nav Menu: Default to collapsed on small screens, add hover expansion when collapsed ([2818a93](https://github.com/michalgm/memoryhole/commit/2818a93242409fe933a1cd3c3bfc6443eddbe0ed))
* **UI:** Open + focus new log with ctrl-l ([bd59de5](https://github.com/michalgm/memoryhole/commit/bd59de57e8b0268ebc99534ee2747b960a447110))

### Bug Fixes

* **UI:** Handle logs missing actions ([1ed74cc](https://github.com/michalgm/memoryhole/commit/1ed74cc61596292ad9caaba02534e593f6f420e6))

## [0.4.1](https://github.com/michalgm/memoryhole/compare/v0.4.0...v0.4.1) (2024-12-13)

## [0.4.0](https://github.com/michalgm/memoryhole/compare/v0.3.0...v0.4.0) (2024-12-13)

### Features

* **DataTable:** Add UI to update views, fix some table bugs ([d86b608](https://github.com/michalgm/memoryhole/commit/d86b608b2e0bec65d7785fae22e09299c1d496a8))
* **Form:** Add Action, User, and Arrest autocomplete fields ([be8e869](https://github.com/michalgm/memoryhole/commit/be8e869a86b85c307d39fc322b7cd7c5db464bdd))
* **UI:** Add Logs management ([5fc4aab](https://github.com/michalgm/memoryhole/commit/5fc4aabb4d772702b6db7c2e0c006141b8e961d0))

### Bug Fixes

* **Form:** base stale data check on updated_at, not created_at ([62cf77b](https://github.com/michalgm/memoryhole/commit/62cf77ba899f27b5b2f180bdbab9fd85f040fc1f))
* **Form:** fix richtextfield not setting dirty ([c640e9d](https://github.com/michalgm/memoryhole/commit/c640e9d5102c726fbb50a5fb494087c6ec3d85ef))
* **Form:** fix tabindex on richtext ([83b01be](https://github.com/michalgm/memoryhole/commit/83b01bed695ef655ee71eacb65867ec0dfbfd415))
* **Form:** handle default value on multilple autocomplete ([c524875](https://github.com/michalgm/memoryhole/commit/c524875fb80f56cd3ebe5deee039c4882ad41ab0))
* **Form:** Improve form default behavior ([8d0d734](https://github.com/michalgm/memoryhole/commit/8d0d734e1e710516b57b28e3b781d58da594533e))
* **Form:** Refactor form to be more stable ([235d913](https://github.com/michalgm/memoryhole/commit/235d913bd086960404cf99bab195a5e86ce5000e))
* **Form:** transform fixes for form ([2b84e1c](https://github.com/michalgm/memoryhole/commit/2b84e1ca5a9a8a8ae616989dc07f1d386f311b43))
* **UI:** fix loading component ([a7ef430](https://github.com/michalgm/memoryhole/commit/a7ef4304d8d0af60c5ac2378c8f871cfcecf7778))
* **UI:** handle missing display_field ([b7f7f0b](https://github.com/michalgm/memoryhole/commit/b7f7f0b9ac05edccb9f30577062949b467e5527a))

## [0.3.0](https://github.com/michalgm/memoryhole/compare/v0.2.0...v0.3.0) (2024-11-29)

### Features

* **Form:** require one of  first_name OR preferred_name on arrestee ([0dc7bc0](https://github.com/michalgm/memoryhole/commit/0dc7bc0ce323128aa18dcf53818b9f4edeb529dc))
* **import_script:** Set has_completed_outtake_form on records imported from online outtake ([540ab6c](https://github.com/michalgm/memoryhole/commit/540ab6caa22fad0c90f4a55296a8dffef551e8d3))
* **UI:** Add a tooltip + icon in navbar showing account expiration info ([0223aa5](https://github.com/michalgm/memoryhole/commit/0223aa565f21342e1cb217782dfb78d0e6a591cc))
* **UI:** Display version in tooltip ([daed0a5](https://github.com/michalgm/memoryhole/commit/daed0a5490be87da6630dcce2ad2946970cb602e))

### Bug Fixes

* **API:** don't valid uniquq email on update if email was not changed ([5d64c22](https://github.com/michalgm/memoryhole/commit/5d64c228582bef3ad5ab807bd69bddf4c7dee24a))
* **Form:** fix dates not getting full props (allow dates to be required) ([47ff6b9](https://github.com/michalgm/memoryhole/commit/47ff6b9de5d4bafb6f99ac52be92f671210be5aa))
* **Form:** FIx new dates being set to now() ([c331298](https://github.com/michalgm/memoryhole/commit/c3312989ef37cdd71c32a46a97db26382b48c05d))
* **Form:** More attempts at taming form states ([eeca008](https://github.com/michalgm/memoryhole/commit/eeca008d5f26f288e84ba059f5f9fa4201a32eb6))

## [0.2.0](https://github.com/michalgm/memoryhole/compare/v0.1.7...v0.2.0) (2024-11-28)

### Features

* **Form:** Before saving a record, check the database to see if the current updated_at value is greater than what was initially fetched - if so, display an error and prevent the save ([b4c9a85](https://github.com/michalgm/memoryhole/commit/b4c9a8551aa444e550a6116a6316f4da46f9b3b1))
* **Form:** only submit changed fields ([4ed9b87](https://github.com/michalgm/memoryhole/commit/4ed9b872b461073df9b01cd3d8565d55fc9a6844))
* **UI:** allow showing react components in displayError ([87c6ba8](https://github.com/michalgm/memoryhole/commit/87c6ba8c8d1096f542c3ebbbd6e5983a25036283))
* **UI:** include city || jurisdiction in action lookup results ([6e9c5b2](https://github.com/michalgm/memoryhole/commit/6e9c5b237bb5069ca3225d999f720c17d3049956))

### Bug Fixes

* **UI:** fix handling of bad dates ([92f37f9](https://github.com/michalgm/memoryhole/commit/92f37f9c486c3ded4fc6386c21bf1b5beeac6e01))
* **UI:** fix snackbar from flashing success on close ([6039705](https://github.com/michalgm/memoryhole/commit/60397053d5c86a40aa6bd01d4f96929ce2a64089))

## [0.1.7](https://github.com/michalgm/memoryhole/compare/v0.1.6...v0.1.7) (2024-11-27)

### Features

* **Form:** Add confirmation when navigating away from dirty form ([46794b6](https://github.com/michalgm/memoryhole/commit/46794b689a677127c11a141d7c53fab7519fbd72))

## [0.1.6](https://github.com/michalgm/memoryhole/compare/v0.1.5...v0.1.6) (2024-11-27)

### Features

* update (backdate) changelog ([109af37](https://github.com/michalgm/memoryhole/commit/109af37211a3835982a551f2010219e8e6df43d5))

## [0.1.5](https://github.com/michalgm/memoryhole/compare/0.1.4...v0.1.5) (2024-11-27)

### Features

- chore: release 0.1.5 ([d2826f4](https://github.com/michalgm/memoryhole/commit/d2826f4))
- add changelog plugin ([74d2383](https://github.com/michalgm/memoryhole/commit/74d2383))
- configure release-it ([46a8438](https://github.com/michalgm/memoryhole/commit/46a8438))
- remove releaserc ([e7cd448](https://github.com/michalgm/memoryhole/commit/e7cd448))
- setting up release-it ([618b915](https://github.com/michalgm/memoryhole/commit/618b915))

## [0.1.4](https://github.com/michalgm/memoryhole/compare/ca4c27e4b2edfb2fb9f2cbbf61d305b227ffb24a...0.1.4) (2024-11-27)

### Features

- add first pass at in-app docs
- add note about names in arrest table footer
- add proton mail suggestion to User email field
- add Sacramento to city + jurisdiction
- Update action defaults on arrest when action is changed
- improve layout
- add breadcrumbs and page title management
- set up release-it

### Bug Fixes

- handle blank arrestee names
- improve arrestee display_name
- fix quicksearch to respect currentAction

## [0.1.3] (2024-11-27)

- Add 'expiresAt' property on user ([c9d64af](https://github.com/michalgm/memoryhole/commit/c9d64af))
- Add 'sectionActions' to form sections ([d26b8b4](https://github.com/michalgm/memoryhole/commit/d26b8b4))
- add actions table ([e09c3f8](https://github.com/michalgm/memoryhole/commit/e09c3f8))
- add arrestee delete ([c664da5](https://github.com/michalgm/memoryhole/commit/c664da5))
- add bulk delete to arrest table ([d4abef8](https://github.com/michalgm/memoryhole/commit/d4abef8))
- add bulk update feature ([627b1a4](https://github.com/michalgm/memoryhole/commit/627b1a4))
- add clearable to date/time pickers ([87a6d75](https://github.com/michalgm/memoryhole/commit/87a6d75))
- add debugging ([bb2ec7a](https://github.com/michalgm/memoryhole/commit/bb2ec7a))
- add deployment stuff ([152f8d1](https://github.com/michalgm/memoryhole/commit/152f8d1))
- add exec bit ([d393e44](https://github.com/michalgm/memoryhole/commit/d393e44))
- add favicon ([5aa729a](https://github.com/michalgm/memoryhole/commit/5aa729a))
- add fields ([76712bb](https://github.com/michalgm/memoryhole/commit/76712bb))
- add first pass at in-app docs ([18c8ccc](https://github.com/michalgm/memoryhole/commit/18c8ccc))
- add generic model query API ([bb262f9](https://github.com/michalgm/memoryhole/commit/bb262f9))
- Add global action state ([defba9f](https://github.com/michalgm/memoryhole/commit/defba9f))
- Add global error handler ([c28ba99](https://github.com/michalgm/memoryhole/commit/c28ba99))
- add jurisdictions ([441a12e](https://github.com/michalgm/memoryhole/commit/441a12e))
- add more tests for arrestee display field ([47f31ab](https://github.com/michalgm/memoryhole/commit/47f31ab))
- add non-lowercase words for labels ([81b612a](https://github.com/michalgm/memoryhole/commit/81b612a))
- add note about names on arrests table ([46711cd](https://github.com/michalgm/memoryhole/commit/46711cd))
- add proton mail suggestion to User email field ([49a23b7](https://github.com/michalgm/memoryhole/commit/49a23b7))
- add richtext fields to log inputs ([ebb6eab](https://github.com/michalgm/memoryhole/commit/ebb6eab))
- add Sacramento ([83dc4af](https://github.com/michalgm/memoryhole/commit/83dc4af))
- add savable views + interface to manage views ([b521033](https://github.com/michalgm/memoryhole/commit/b521033))
- add validation ([1bf091f](https://github.com/michalgm/memoryhole/commit/1bf091f))
- add/improve arrest fields ([9bd6096](https://github.com/michalgm/memoryhole/commit/9bd6096))
- adding yarn deps ([14af003](https://github.com/michalgm/memoryhole/commit/14af003))
- aded hotline logs ([e0bf812](https://github.com/michalgm/memoryhole/commit/e0bf812))
- allow created/updated fields ([b376840](https://github.com/michalgm/memoryhole/commit/b376840))
- allow for custom onchange actions ([dddb3b0](https://github.com/michalgm/memoryhole/commit/dddb3b0))
- allow helpertext on checkbox ([09714d1](https://github.com/michalgm/memoryhole/commit/09714d1))
- allow styling of loadingButton ([b5e78d0](https://github.com/michalgm/memoryhole/commit/b5e78d0))
- arrestee table full width ([8e66d62](https://github.com/michalgm/memoryhole/commit/8e66d62))
- base attempt to restrict some logins via IP ([13757ee](https://github.com/michalgm/memoryhole/commit/13757ee))
- better arrestee name notes in table footer ([546ade9](https://github.com/michalgm/memoryhole/commit/546ade9))
- better header styles ([997f08f](https://github.com/michalgm/memoryhole/commit/997f08f))
- better layout ([52a3500](https://github.com/michalgm/memoryhole/commit/52a3500))
- better messages on pw update issues ([deb6b7d](https://github.com/michalgm/memoryhole/commit/deb6b7d))
- bump rw version ([33cde58](https://github.com/michalgm/memoryhole/commit/33cde58))
- caching fix ([4041ec2](https://github.com/michalgm/memoryhole/commit/4041ec2))
- clean up auth error messages ([ddfb174](https://github.com/michalgm/memoryhole/commit/ddfb174))
- clean up build issues ([4a61cc1](https://github.com/michalgm/memoryhole/commit/4a61cc1))
- clean up some bulkUpdate issues ([513f3dd](https://github.com/michalgm/memoryhole/commit/513f3dd))
- cleanup ([71a5a74](https://github.com/michalgm/memoryhole/commit/71a5a74))
- cleanup ([5162451](https://github.com/michalgm/memoryhole/commit/5162451))
- cleanup ([6b8e5e6](https://github.com/michalgm/memoryhole/commit/6b8e5e6))
- cleanup ([15f5f78](https://github.com/michalgm/memoryhole/commit/15f5f78))
- data table cleanups + improvements ([ead38dc](https://github.com/michalgm/memoryhole/commit/ead38dc))
- Delete deployment/linode.txt ([6ddc3cc](https://github.com/michalgm/memoryhole/commit/6ddc3cc))
- Delete deployment/nginx.conf ([fc4da1e](https://github.com/michalgm/memoryhole/commit/fc4da1e))
- dependecy cleanup ([1d03c36](https://github.com/michalgm/memoryhole/commit/1d03c36))
- dependency updates ([320701d](https://github.com/michalgm/memoryhole/commit/320701d))
- deploy changes ([0b1881b](https://github.com/michalgm/memoryhole/commit/0b1881b))
- disable autocomplete on forms ([bc2d6b4](https://github.com/michalgm/memoryhole/commit/bc2d6b4))
- don't load action info from 'all actions' ([36e733e](https://github.com/michalgm/memoryhole/commit/36e733e))
- don't log out after user create ([97c16d7](https://github.com/michalgm/memoryhole/commit/97c16d7))
- drop some dependencies ([a23da71](https://github.com/michalgm/memoryhole/commit/a23da71))
- dumb fix ([38e4aa2](https://github.com/michalgm/memoryhole/commit/38e4aa2))
- expire login after 6 hours ([7d609c2](https://github.com/michalgm/memoryhole/commit/7d609c2))
- first pass at dockert sheets ([53255fe](https://github.com/michalgm/memoryhole/commit/53255fe))
- fix admin page ([854953e](https://github.com/michalgm/memoryhole/commit/854953e))
- fix arrestee display_field bugs ([80a8348](https://github.com/michalgm/memoryhole/commit/80a8348))
- fix auth onboarding ([061a51a](https://github.com/michalgm/memoryhole/commit/061a51a))
- fix bulk update for dates ([c819468](https://github.com/michalgm/memoryhole/commit/c819468))
- fix column ordering ([e1547f0](https://github.com/michalgm/memoryhole/commit/e1547f0))
- fix contact info on docket sheets ([e9cd991](https://github.com/michalgm/memoryhole/commit/e9cd991))
- fix court_time ([3c765c3](https://github.com/michalgm/memoryhole/commit/3c765c3))
- fix csv formatting ([c53c810](https://github.com/michalgm/memoryhole/commit/c53c810))
- fix datatable filtering ([632bec9](https://github.com/michalgm/memoryhole/commit/632bec9))
- fix date validator ([ded2b6b](https://github.com/michalgm/memoryhole/commit/ded2b6b))
- fix docket sheet ([1db6b11](https://github.com/michalgm/memoryhole/commit/1db6b11))
- fix docket sheet defaults ([fa66173](https://github.com/michalgm/memoryhole/commit/fa66173))
- fix docs typo ([69dee93](https://github.com/michalgm/memoryhole/commit/69dee93))
- fix double dates ([2346ebb](https://github.com/michalgm/memoryhole/commit/2346ebb))
- fix dupe name fields ([7341e74](https://github.com/michalgm/memoryhole/commit/7341e74))
- fix error snackbar timeout ([4d11093](https://github.com/michalgm/memoryhole/commit/4d11093))
- fix export ([75f9939](https://github.com/michalgm/memoryhole/commit/75f9939))
- fix globalDisplayError ([37f1c0a](https://github.com/michalgm/memoryhole/commit/37f1c0a))
- fix mui icon imports ([0223a4b](https://github.com/michalgm/memoryhole/commit/0223a4b))
- fix navbar links ([2de0fd2](https://github.com/michalgm/memoryhole/commit/2de0fd2))
- fix navbar re-render casuing actions lookup ([99e060e](https://github.com/michalgm/memoryhole/commit/99e060e))
- fix quicksearch to respect currentAction ([e722de9](https://github.com/michalgm/memoryhole/commit/e722de9))
- fix routes ([570370d](https://github.com/michalgm/memoryhole/commit/570370d))
- fix seeds ([b61e160](https://github.com/michalgm/memoryhole/commit/b61e160))
- fix snackbar to not cause rerenders ([dc98234](https://github.com/michalgm/memoryhole/commit/dc98234))
- fix some auth bugs ([2a8959c](https://github.com/michalgm/memoryhole/commit/2a8959c))
- fix subject/text on new user emails ([063828c](https://github.com/michalgm/memoryhole/commit/063828c))
- fix tests! ([2647513](https://github.com/michalgm/memoryhole/commit/2647513))
- fix timezone issue ([f94cee5](https://github.com/michalgm/memoryhole/commit/f94cee5))
- fix typos ([6956eb0](https://github.com/michalgm/memoryhole/commit/6956eb0))
- fix vars to serve multiple instances ([7e1837a](https://github.com/michalgm/memoryhole/commit/7e1837a))
- fixc number inputs ([f71e465](https://github.com/michalgm/memoryhole/commit/f71e465))
- getter more done ([a6b49d3](https://github.com/michalgm/memoryhole/commit/a6b49d3))
- gte rid of cruft ([5590c61](https://github.com/michalgm/memoryhole/commit/5590c61))
- handle blank arrestee names ([ae44d19](https://github.com/michalgm/memoryhole/commit/ae44d19))
- handle email + user onboarding ([94b05ea](https://github.com/michalgm/memoryhole/commit/94b05ea))
- handle expired auth + redirect ([0715999](https://github.com/michalgm/memoryhole/commit/0715999))
- handle invalid times on process_intake ([5bc9968](https://github.com/michalgm/memoryhole/commit/5bc9968))
- handle loading on datatable ([17ecfd4](https://github.com/michalgm/memoryhole/commit/17ecfd4))
- hide admin link for non-admins ([04b86cd](https://github.com/michalgm/memoryhole/commit/04b86cd))
- import script tweaks ([eef7e29](https://github.com/michalgm/memoryhole/commit/eef7e29))
- improve arrestee display_name ([9e38b66](https://github.com/michalgm/memoryhole/commit/9e38b66))
- improve Arrestee updates ([2e4aa97](https://github.com/michalgm/memoryhole/commit/2e4aa97))
- improve datable ([8c9a30b](https://github.com/michalgm/memoryhole/commit/8c9a30b))
- improve footer layout ([5124e92](https://github.com/michalgm/memoryhole/commit/5124e92))
- improve help texts ([d67ced0](https://github.com/michalgm/memoryhole/commit/d67ced0))
- improve radio and checkbox inputs ([1460c64](https://github.com/michalgm/memoryhole/commit/1460c64))
- improve schema ([bbd128d](https://github.com/michalgm/memoryhole/commit/bbd128d))
- improve table footer text ([7e0deb3](https://github.com/michalgm/memoryhole/commit/7e0deb3))
- improve tables ([ff7c45f](https://github.com/michalgm/memoryhole/commit/ff7c45f))
- improve users ([2b895a6](https://github.com/michalgm/memoryhole/commit/2b895a6))
- include label on rich text fields ([87afea0](https://github.com/michalgm/memoryhole/commit/87afea0))
- Initial commit ([cf47edc](https://github.com/michalgm/memoryhole/commit/cf47edc))
- linter gone wild ([999848f](https://github.com/michalgm/memoryhole/commit/999848f))
- make appbar have fixed position ([3080f8a](https://github.com/michalgm/memoryhole/commit/3080f8a))
- making progress ([da302c0](https://github.com/michalgm/memoryhole/commit/da302c0))
- many fixes ([faa3640](https://github.com/michalgm/memoryhole/commit/faa3640))
- more better ([54f04a9](https://github.com/michalgm/memoryhole/commit/54f04a9))
- more cleanup ([5a8bc92](https://github.com/michalgm/memoryhole/commit/5a8bc92))
- more cruft be gone ([9e35a7a](https://github.com/michalgm/memoryhole/commit/9e35a7a))
- more error tweaks ([0773dcb](https://github.com/michalgm/memoryhole/commit/0773dcb))
- more fix export ([a4954a6](https://github.com/michalgm/memoryhole/commit/a4954a6))
- more nonsense ([0a1fc6c](https://github.com/michalgm/memoryhole/commit/0a1fc6c))
- more storybook setup ([3c968ab](https://github.com/michalgm/memoryhole/commit/3c968ab))
- more table state fixes ([9e2e07f](https://github.com/michalgm/memoryhole/commit/9e2e07f))
- more works ([f814706](https://github.com/michalgm/memoryhole/commit/f814706))
- move some deps into dev ([1817bb2](https://github.com/michalgm/memoryhole/commit/1817bb2))
- new Login, ForgetPassword, ResetPassword, and 404 pages following rest of app patterns ([158425e](https://github.com/michalgm/memoryhole/commit/158425e))
- no mailserver in dev mode ([e65abf1](https://github.com/michalgm/memoryhole/commit/e65abf1))
- one last try ([972ece3](https://github.com/michalgm/memoryhole/commit/972ece3))
- oops ([42dbb12](https://github.com/michalgm/memoryhole/commit/42dbb12))
- preserve table state across page changes ([8a216e1](https://github.com/michalgm/memoryhole/commit/8a216e1))
- refactor arresteefields ([b0550e1](https://github.com/michalgm/memoryhole/commit/b0550e1))
- refactor forms for arresteearrest and user ([e676016](https://github.com/michalgm/memoryhole/commit/e676016))
- refresh dependencies ([918524f](https://github.com/michalgm/memoryhole/commit/918524f))
- refresh dependencies ([cc10728](https://github.com/michalgm/memoryhole/commit/cc10728))
- refresh deps ([e5f3f25](https://github.com/michalgm/memoryhole/commit/e5f3f25))
- Release 0.1.4 ([2eff1c3](https://github.com/michalgm/memoryhole/commit/2eff1c3))
- remove cruft ([ad30332](https://github.com/michalgm/memoryhole/commit/ad30332))
- remove cruft ([d78cd35](https://github.com/michalgm/memoryhole/commit/d78cd35))
- remove uneccesary type ([d4466f3](https://github.com/michalgm/memoryhole/commit/d4466f3))
- remove yarnPath ([d4d728c](https://github.com/michalgm/memoryhole/commit/d4d728c))
- restore state from view better ([7f8e302](https://github.com/michalgm/memoryhole/commit/7f8e302))
- restyle success/error notification ([f8dbe9f](https://github.com/michalgm/memoryhole/commit/f8dbe9f))
- rm package-lock.json ([d56d376](https://github.com/michalgm/memoryhole/commit/d56d376))
- saving todo ([c98ee64](https://github.com/michalgm/memoryhole/commit/c98ee64))
- Set action defaults on arrest when action is changed ([d9b3251](https://github.com/michalgm/memoryhole/commit/d9b3251))
- set actions default sort ([03e7675](https://github.com/michalgm/memoryhole/commit/03e7675))
- set arrest_date_max to be end of day ([390bd44](https://github.com/michalgm/memoryhole/commit/390bd44))
- set defaul on needs_review ([dbffb04](https://github.com/michalgm/memoryhole/commit/dbffb04))
- set log level ([580607b](https://github.com/michalgm/memoryhole/commit/580607b))
- set up default action ([0859731](https://github.com/michalgm/memoryhole/commit/0859731))
- setting up semantic-release ([6703925](https://github.com/michalgm/memoryhole/commit/6703925))
- shaping things out ([482818f](https://github.com/michalgm/memoryhole/commit/482818f))
- storybook config ([e505d8d](https://github.com/michalgm/memoryhole/commit/e505d8d))
- syntax fix ([cc6296f](https://github.com/michalgm/memoryhole/commit/cc6296f))
- this is the fix ([0a5c312](https://github.com/michalgm/memoryhole/commit/0a5c312))
- trim all inputs ([bbac8a6](https://github.com/michalgm/memoryhole/commit/bbac8a6))
- try release-it ([aeacf89](https://github.com/michalgm/memoryhole/commit/aeacf89))
- try to fix display field bug ([8658b79](https://github.com/michalgm/memoryhole/commit/8658b79))
- try to fix mystery bug ([96eaa98](https://github.com/michalgm/memoryhole/commit/96eaa98))
- underlink nav links ([76ae95a](https://github.com/michalgm/memoryhole/commit/76ae95a))
- update babel config ([3bda835](https://github.com/michalgm/memoryhole/commit/3bda835))
- update default restriction polices ([8f91f94](https://github.com/michalgm/memoryhole/commit/8f91f94))
- update dependancies ([64675ef](https://github.com/michalgm/memoryhole/commit/64675ef))
- update dependencies ([380a307](https://github.com/michalgm/memoryhole/commit/380a307))
- update dependencies ([d5c9f16](https://github.com/michalgm/memoryhole/commit/d5c9f16))
- update dependencies ([cef8ed2](https://github.com/michalgm/memoryhole/commit/cef8ed2))
- update deps ([3bf1e0b](https://github.com/michalgm/memoryhole/commit/3bf1e0b))
- update deps ([fe66972](https://github.com/michalgm/memoryhole/commit/fe66972))
- update display field logic ([cf20764](https://github.com/michalgm/memoryhole/commit/cf20764))
- update gitignore ([b48fac5](https://github.com/michalgm/memoryhole/commit/b48fac5))
- update gitignore ([6403da4](https://github.com/michalgm/memoryhole/commit/6403da4))
- update nvmrc ([79cfb19](https://github.com/michalgm/memoryhole/commit/79cfb19))
- update readme ([dedb492](https://github.com/michalgm/memoryhole/commit/dedb492))
- update readme ([8f8b83d](https://github.com/michalgm/memoryhole/commit/8f8b83d))
- update redwood ([39e41a3](https://github.com/michalgm/memoryhole/commit/39e41a3))
- update releaserc ([de55577](https://github.com/michalgm/memoryhole/commit/de55577))
- Update restictions on user role change ([a15c660](https://github.com/michalgm/memoryhole/commit/a15c660))
- update rw ([7d0134c](https://github.com/michalgm/memoryhole/commit/7d0134c))
- update to rw 8.1.0 ([092fa3b](https://github.com/michalgm/memoryhole/commit/092fa3b))
- update to rw 8.4.0 ([5838917](https://github.com/michalgm/memoryhole/commit/5838917))
- update todo ([11f7c90](https://github.com/michalgm/memoryhole/commit/11f7c90))
- upgrade dependencies ([890066b](https://github.com/michalgm/memoryhole/commit/890066b))
- upgrade to redwood 7.7.4 ([e479335](https://github.com/michalgm/memoryhole/commit/e479335))
- upgrade to redwoodjs 8 ([52915e9](https://github.com/michalgm/memoryhole/commit/52915e9))
- upgrade to rw 7.4.3 ([3b3a514](https://github.com/michalgm/memoryhole/commit/3b3a514))
- Users should not be able to change their own restrictions ([bcdf694](https://github.com/michalgm/memoryhole/commit/bcdf694))
- validate unique email on user ([bb55eb9](https://github.com/michalgm/memoryhole/commit/bb55eb9))
- fix: update releaserc ([ca4c27e](https://github.com/michalgm/memoryhole/commit/ca4c27e))
