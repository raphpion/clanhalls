import { useId } from 'react';

import { Field, useFormikContext } from 'formik';
import { Fragment } from 'react/jsx-runtime';

import { CredentialScopes, type Scopes } from '$helpers/credentials';

import { Checkbox } from '../../../ui/checkbox';
import { Label } from '../../../ui/label';

type FormValues = {
  scope: Scopes;
};

type ScopeProps = {
  name: CredentialScopes;
  label: string;
};

function Scope<T extends FormValues>({ name, label }: ScopeProps) {
  const id = useId();
  const { values, setFieldValue } = useFormikContext<T>();
  const checked = values.scope[name];

  return (
    <Field
      id={`${id}`}
      name={name}
      render={({ field }) => (
        <div className="flex flex-row space-x-2">
          <Checkbox
            {...field}
            label={label}
            checked={checked}
            onChange={() => setFieldValue(name, !checked)}
          />
          <Label htmlFor={id}>{label}</Label>
        </div>
      )}
    />
  );
}

function SelectScope<T extends FormValues>() {
  return (
    <Fragment>
      <Scope<T> name={CredentialScopes.CLAN_REPORTING} label="Clan Reporting" />
    </Fragment>
  );
}

export default SelectScope;
