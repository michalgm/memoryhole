DELETE FROM "OptionSetValue";

-- Seed option sets for memoryhole
-- This file is used by both migrations and the seed script
-- states
INSERT INTO
  "OptionSet" (NAME)
VALUES
  ('states') ON CONFLICT (NAME)
DO NOTHING;

INSERT INTO
  "OptionSetValue" (option_set_id, LABEL, VALUE, is_static, "order")
SELECT
  id,
  LABEL,
  VALUE,
  is_static,
  "order"
FROM
  (
    VALUES
      ('states', 'Alabama', 'Alabama', FALSE, 1),
      ('states', 'Alaska', 'Alaska', FALSE, 2),
      ('states', 'Arizona', 'Arizona', FALSE, 3),
      ('states', 'Arkansas', 'Arkansas', FALSE, 4),
      ('states', 'California', 'California', FALSE, 5),
      ('states', 'Colorado', 'Colorado', FALSE, 6),
      ('states', 'Connecticut', 'Connecticut', FALSE, 7),
      ('states', 'Delaware', 'Delaware', FALSE, 8),
      ('states', 'Florida', 'Florida', FALSE, 9),
      ('states', 'Georgia', 'Georgia', FALSE, 10),
      ('states', 'Hawaii', 'Hawaii', FALSE, 11),
      ('states', 'Idaho', 'Idaho', FALSE, 12),
      ('states', 'Illinois', 'Illinois', FALSE, 13),
      ('states', 'Indiana', 'Indiana', FALSE, 14),
      ('states', 'Iowa', 'Iowa', FALSE, 15),
      ('states', 'Kansas', 'Kansas', FALSE, 16),
      ('states', 'Kentucky', 'Kentucky', FALSE, 17),
      ('states', 'Louisiana', 'Louisiana', FALSE, 18),
      ('states', 'Maine', 'Maine', FALSE, 19),
      ('states', 'Maryland', 'Maryland', FALSE, 20),
      (
        'states',
        'Massachusetts',
        'Massachusetts',
        FALSE,
        21
      ),
      ('states', 'Michigan', 'Michigan', FALSE, 22),
      ('states', 'Minnesota', 'Minnesota', FALSE, 23),
      ('states', 'Mississippi', 'Mississippi', FALSE, 24),
      ('states', 'Missouri', 'Missouri', FALSE, 25),
      ('states', 'Montana', 'Montana', FALSE, 26),
      ('states', 'Nebraska', 'Nebraska', FALSE, 27),
      ('states', 'Nevada', 'Nevada', FALSE, 28),
      (
        'states',
        'New Hampshire',
        'New Hampshire',
        FALSE,
        29
      ),
      ('states', 'New Jersey', 'New Jersey', FALSE, 30),
      ('states', 'New Mexico', 'New Mexico', FALSE, 31),
      ('states', 'New York', 'New York', FALSE, 32),
      (
        'states',
        'North Carolina',
        'North Carolina',
        FALSE,
        33
      ),
      (
        'states',
        'North Dakota',
        'North Dakota',
        FALSE,
        34
      ),
      ('states', 'Ohio', 'Ohio', FALSE, 35),
      ('states', 'Oklahoma', 'Oklahoma', FALSE, 36),
      ('states', 'Oregon', 'Oregon', FALSE, 37),
      (
        'states',
        'Pennsylvania',
        'Pennsylvania',
        FALSE,
        38
      ),
      (
        'states',
        'Rhode Island',
        'Rhode Island',
        FALSE,
        39
      ),
      (
        'states',
        'South Carolina',
        'South Carolina',
        FALSE,
        40
      ),
      (
        'states',
        'South Dakota',
        'South Dakota',
        FALSE,
        41
      ),
      ('states', 'Tennessee', 'Tennessee', FALSE, 42),
      ('states', 'Texas', 'Texas', FALSE, 43),
      ('states', 'Utah', 'Utah', FALSE, 44),
      ('states', 'Vermont', 'Vermont', FALSE, 45),
      ('states', 'Virginia', 'Virginia', FALSE, 46),
      ('states', 'Washington', 'Washington', FALSE, 47),
      (
        'states',
        'West Virginia',
        'West Virginia',
        FALSE,
        48
      ),
      ('states', 'Wisconsin', 'Wisconsin', FALSE, 49),
      ('states', 'Wyoming', 'Wyoming', FALSE, 50)
  ) AS t (set_name, LABEL, VALUE, is_static, "order")
  JOIN "OptionSet" os ON os.name=t.set_name ON CONFLICT (option_set_id, VALUE)
DO
UPDATE
SET
  LABEL=EXCLUDED.label,
  is_static=EXCLUDED.is_static,
  "order"=EXCLUDED."order";

-- arrest_release_type
INSERT INTO
  "OptionSet" (NAME)
VALUES
  ('arrest_release_type') ON CONFLICT (NAME)
DO NOTHING;

INSERT INTO
  "OptionSetValue" (option_set_id, LABEL, VALUE, is_static, "order")
SELECT
  id,
  LABEL,
  VALUE,
  is_static,
  "order"
FROM
  (
    VALUES
      (
        'arrest_release_type',
        'Unknown/In Custody',
        'Unknown/In Custody',
        TRUE,
        1
      ),
      (
        'arrest_release_type',
        'Unknown Released',
        'Unknown Released',
        TRUE,
        2
      ),
      (
        'arrest_release_type',
        'Own Recognizance',
        'Own Recognizance',
        FALSE,
        3
      ),
      ('arrest_release_type', 'Bail', 'Bail', FALSE, 4),
      (
        'arrest_release_type',
        'Cited Out',
        'Cited Out',
        FALSE,
        5
      ),
      (
        'arrest_release_type',
        'Arraigned',
        'Arraigned',
        FALSE,
        6
      ),
      (
        'arrest_release_type',
        'Dismissed',
        'Dismissed',
        FALSE,
        7
      ),
      (
        'arrest_release_type',
        'Charges Dropped',
        'Charges Dropped',
        FALSE,
        8
      ),
      (
        'arrest_release_type',
        'Charges Pending',
        'Charges Pending',
        FALSE,
        9
      ),
      (
        'arrest_release_type',
        'Guilty Plea',
        'Guilty Plea',
        FALSE,
        10
      ),
      (
        'arrest_release_type',
        'Out With No Complaint',
        'Out With No Complaint',
        FALSE,
        11
      )
  ) AS t (set_name, LABEL, VALUE, is_static, "order")
  JOIN "OptionSet" os ON os.name=t.set_name ON CONFLICT (option_set_id, VALUE)
DO
UPDATE
SET
  LABEL=EXCLUDED.label,
  is_static=EXCLUDED.is_static,
  "order"=EXCLUDED."order";

-- cities
INSERT INTO
  "OptionSet" (NAME)
VALUES
  ('cities') ON CONFLICT (NAME)
DO NOTHING;

INSERT INTO
  "OptionSetValue" (option_set_id, LABEL, VALUE, is_static, "order")
SELECT
  id,
  LABEL,
  VALUE,
  is_static,
  "order"
FROM
  (
    VALUES
      ('cities', 'Oakland', 'Oakland', FALSE, 1),
      (
        'cities',
        'San Francisco',
        'San Francisco',
        FALSE,
        2
      ),
      ('cities', 'Berkeley', 'Berkeley', FALSE, 3),
      ('cities', 'Emeryville', 'Emeryville', FALSE, 4),
      ('cities', 'Dublin', 'Dublin', FALSE, 5),
      ('cities', 'Hayward', 'Hayward', FALSE, 6),
      ('cities', 'Richmond', 'Richmond', FALSE, 7),
      ('cities', 'San Jose', 'San Jose', FALSE, 8),
      ('cities', 'San Leandro', 'San Leandro', FALSE, 9),
      ('cities', 'San Mateo', 'San Mateo', FALSE, 10),
      ('cities', 'Santa Cruz', 'Santa Cruz', FALSE, 11),
      (
        'cities',
        'Walnut Creek',
        'Walnut Creek',
        FALSE,
        12
      ),
      ('cities', 'Sacramento', 'Sacramento', FALSE, 13),
      ('cities', 'Concord', 'Concord', FALSE, 14),
      ('cities', 'Palo Alto', 'Palo Alto', FALSE, 15),
      ('cities', 'Other', 'Other', FALSE, 16)
  ) AS t (set_name, LABEL, VALUE, is_static, "order")
  JOIN "OptionSet" os ON os.name=t.set_name ON CONFLICT (option_set_id, VALUE)
DO
UPDATE
SET
  LABEL=EXCLUDED.label,
  is_static=EXCLUDED.is_static,
  "order"=EXCLUDED."order";

-- jurisdictions
INSERT INTO
  "OptionSet" (NAME)
VALUES
  ('jurisdictions') ON CONFLICT (NAME)
DO NOTHING;

INSERT INTO
  "OptionSetValue" (option_set_id, LABEL, VALUE, is_static, "order")
SELECT
  id,
  LABEL,
  VALUE,
  is_static,
  "order"
FROM
  (
    VALUES
      (
        'jurisdictions',
        'San Francisco',
        'San Francisco',
        FALSE,
        1
      ),
      ('jurisdictions', 'Alameda', 'Alameda', FALSE, 2),
      ('jurisdictions', 'Federal', 'Federal', FALSE, 3),
      (
        'jurisdictions',
        'Contra Costa',
        'Contra Costa',
        FALSE,
        4
      ),
      (
        'jurisdictions',
        'San Mateo',
        'San Mateo',
        FALSE,
        5
      ),
      (
        'jurisdictions',
        'Santa Clara',
        'Santa Clara',
        FALSE,
        6
      ),
      (
        'jurisdictions',
        'Santa Cruz',
        'Santa Cruz',
        FALSE,
        7
      ),
      ('jurisdictions', 'Marin', 'Marin', FALSE, 8),
      ('jurisdictions', 'Yolo', 'Yolo', FALSE, 9),
      (
        'jurisdictions',
        'Humboldt',
        'Humboldt',
        FALSE,
        10
      ),
      (
        'jurisdictions',
        'Sacramento',
        'Sacramento',
        FALSE,
        11
      ),
      ('jurisdictions', 'Solano', 'Solano', FALSE, 12),
      ('jurisdictions', 'Sonoma', 'Sonoma', FALSE, 13),
      ('jurisdictions', 'Napa', 'Napa', FALSE, 14)
  ) AS t (set_name, LABEL, VALUE, is_static, "order")
  JOIN "OptionSet" os ON os.name=t.set_name ON CONFLICT (option_set_id, VALUE)
DO
UPDATE
SET
  LABEL=EXCLUDED.label,
  is_static=EXCLUDED.is_static,
  "order"=EXCLUDED."order";

-- arrest_custody_status
INSERT INTO
  "OptionSet" (NAME)
VALUES
  ('arrest_custody_status') ON CONFLICT (NAME)
DO NOTHING;

INSERT INTO
  "OptionSetValue" (option_set_id, LABEL, VALUE, is_static, "order")
SELECT
  id,
  LABEL,
  VALUE,
  is_static,
  "order"
FROM
  (
    VALUES
      (
        'arrest_custody_status',
        'Unknown/Unconfirmed',
        'Unknown/Unconfirmed',
        FALSE,
        1
      ),
      (
        'arrest_custody_status',
        'In Custody',
        'In Custody',
        FALSE,
        2
      ),
      (
        'arrest_custody_status',
        'Out of Custody',
        'Out of Custody',
        TRUE,
        3
      )
  ) AS t (set_name, LABEL, VALUE, is_static, "order")
  JOIN "OptionSet" os ON os.name=t.set_name ON CONFLICT (option_set_id, VALUE)
DO
UPDATE
SET
  LABEL=EXCLUDED.label,
  is_static=EXCLUDED.is_static,
  "order"=EXCLUDED."order";

-- jail_population
INSERT INTO
  "OptionSet" (NAME)
VALUES
  ('jail_population') ON CONFLICT (NAME)
DO NOTHING;

INSERT INTO
  "OptionSetValue" (option_set_id, LABEL, VALUE, is_static, "order")
SELECT
  id,
  LABEL,
  VALUE,
  is_static,
  "order"
FROM
  (
    VALUES
      ('jail_population', 'Male', 'Male', FALSE, 1),
      ('jail_population', 'Female', 'Female', FALSE, 2),
      (
        'jail_population',
        'Transgender/Gender Variant/Non-Binary',
        'Transgender/Gender Variant/Non-Binary',
        FALSE,
        3
      ),
      ('jail_population', 'Unknown', 'Unknown', TRUE, 4)
  ) AS t (set_name, LABEL, VALUE, is_static, "order")
  JOIN "OptionSet" os ON os.name=t.set_name ON CONFLICT (option_set_id, VALUE)
DO
UPDATE
SET
  LABEL=EXCLUDED.label,
  is_static=EXCLUDED.is_static,
  "order"=EXCLUDED."order";

-- arrest_case_status
INSERT INTO
  "OptionSet" (NAME)
VALUES
  ('arrest_case_status') ON CONFLICT (NAME)
DO NOTHING;

INSERT INTO
  "OptionSetValue" (option_set_id, LABEL, VALUE, is_static, "order")
SELECT
  id,
  LABEL,
  VALUE,
  is_static,
  "order"
FROM
  (
    VALUES
      (
        'arrest_case_status',
        'Pre-Arraignment',
        'Pre-Arraignment',
        TRUE,
        1
      ),
      (
        'arrest_case_status',
        'No Charges Filed',
        'No Charges Filed',
        FALSE,
        2
      ),
      (
        'arrest_case_status',
        'Pre-Trial',
        'Pre-Trial',
        FALSE,
        3
      ),
      ('arrest_case_status', 'Trial', 'Trial', FALSE, 4),
      (
        'arrest_case_status',
        'Resolved',
        'Resolved',
        FALSE,
        5
      ),
      (
        'arrest_case_status',
        'Unknown',
        'Unknown',
        TRUE,
        6
      )
  ) AS t (set_name, LABEL, VALUE, is_static, "order")
  JOIN "OptionSet" os ON os.name=t.set_name ON CONFLICT (option_set_id, VALUE)
DO
UPDATE
SET
  LABEL=EXCLUDED.label,
  is_static=EXCLUDED.is_static,
  "order"=EXCLUDED."order";

-- arrest_disposition
INSERT INTO
  "OptionSet" (NAME)
VALUES
  ('arrest_disposition') ON CONFLICT (NAME)
DO NOTHING;

INSERT INTO
  "OptionSetValue" (option_set_id, LABEL, VALUE, is_static, "order")
SELECT
  id,
  LABEL,
  VALUE,
  is_static,
  "order"
FROM
  (
    VALUES
      ('arrest_disposition', 'Open', 'Open', TRUE, 1),
      (
        'arrest_disposition',
        'Discharged w/o Prejudice',
        'Discharged w/o Prejudice',
        FALSE,
        2
      ),
      (
        'arrest_disposition',
        'Discharged w/ Prejudice',
        'Discharged w/ Prejudice',
        FALSE,
        3
      ),
      (
        'arrest_disposition',
        'Guilty Plea',
        'Guilty Plea',
        FALSE,
        4
      ),
      (
        'arrest_disposition',
        'Dismissed',
        'Dismissed',
        FALSE,
        5
      ),
      (
        'arrest_disposition',
        'Acquitted',
        'Acquitted',
        FALSE,
        6
      ),
      (
        'arrest_disposition',
        'Guilty Verdict',
        'Guilty Verdict',
        FALSE,
        7
      ),
      (
        'arrest_disposition',
        'No Action',
        'No Action',
        FALSE,
        8
      ),
      (
        'arrest_disposition',
        'Continued for Dismissal',
        'Continued for Dismissal',
        FALSE,
        9
      ),
      (
        'arrest_disposition',
        'Bench Warrant',
        'Bench Warrant',
        FALSE,
        10
      ),
      (
        'arrest_disposition',
        'No Complaint FIled',
        'No Complaint FIled',
        FALSE,
        11
      ),
      (
        'arrest_disposition',
        'Warrant Letter',
        'Warrant Letter',
        FALSE,
        12
      ),
      (
        'arrest_disposition',
        'No Contest',
        'No Contest',
        FALSE,
        13
      )
  ) AS t (set_name, LABEL, VALUE, is_static, "order")
  JOIN "OptionSet" os ON os.name=t.set_name ON CONFLICT (option_set_id, VALUE)
DO
UPDATE
SET
  LABEL=EXCLUDED.label,
  is_static=EXCLUDED.is_static,
  "order"=EXCLUDED."order";

-- log_type
INSERT INTO
  "OptionSet" (NAME)
VALUES
  ('log_type') ON CONFLICT (NAME)
DO NOTHING;

INSERT INTO
  "OptionSetValue" (option_set_id, LABEL, VALUE, is_static, "order")
SELECT
  id,
  LABEL,
  VALUE,
  is_static,
  "order"
FROM
  (
    VALUES
      (
        'log_type',
        'Shift Summary',
        'Shift Summary',
        TRUE,
        1
      ),
      ('log_type', 'Jail Call', 'Jail Call', FALSE, 2),
      (
        'log_type',
        'Witness Call',
        'Witness Call',
        FALSE,
        3
      ),
      (
        'log_type',
        'Support Call',
        'Support Call',
        FALSE,
        4
      ),
      (
        'log_type',
        'Out-of-Custody Call',
        'Out-of-Custody Call',
        FALSE,
        5
      ),
      (
        'log_type',
        'Text Message',
        'Text Message',
        FALSE,
        6
      ),
      ('log_type', 'Email', 'Email', FALSE, 7),
      ('log_type', 'Note', 'Note', FALSE, 8),
      ('log_type', 'Other', 'Other', FALSE, 9)
  ) AS t (set_name, LABEL, VALUE, is_static, "order")
  JOIN "OptionSet" os ON os.name=t.set_name ON CONFLICT (option_set_id, VALUE)
DO
UPDATE
SET
  LABEL=EXCLUDED.label,
  is_static=EXCLUDED.is_static,
  "order"=EXCLUDED."order";