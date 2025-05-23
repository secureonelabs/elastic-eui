import React, { useState, useEffect } from 'react';
import { assertUnreachable, PropTypes } from 'react-view';
import {
  useEuiTheme,
  useIsWithinBreakpoints,
  EuiTitle,
  EuiCodeBlock,
  EuiSpacer,
  EuiSwitch,
  EuiRadioGroup,
  EuiFieldText,
  EuiCode,
  EuiSelect,
  EuiFieldNumber,
  EuiToolTip,
  EuiTable,
  EuiTableBody,
  EuiTableHeader,
  EuiTableHeaderCell,
  EuiTableRow,
  EuiTableRowCell,
  EuiTextColor,
  EuiTextArea,
  EuiFormRow,
  EuiText,
  EuiMarkdownFormat,
} from '../../../../src';
import {
  parsingPluginList,
  processingPluginListWithLinkedProps,
  processingPluginListWithBoldProps,
} from '../props/markdown_format';

export const markup = (text, isPlayground) => {
  return (
    <EuiMarkdownFormat
      textSize="xs"
      color="subdued"
      parsingPluginList={parsingPluginList}
      processingPluginList={
        isPlayground
          ? processingPluginListWithBoldProps
          : processingPluginListWithLinkedProps
      }
    >
      {text}
    </EuiMarkdownFormat>
  );
};

export const humanizeType = (type) => {
  if (!type) {
    return '';
  }

  let humanizedType;

  switch (type.name) {
    case 'enum':
      if (Array.isArray(type.value)) {
        humanizedType = type.value.map(({ value }) => value).join(', ');
        break;
      }
      humanizedType = type.value;
      break;

    case 'union':
      if (Array.isArray(type.value)) {
        const unionValues = type.value.map(({ name }) => name);
        unionValues[unionValues.length - 1] = `or ${
          unionValues[unionValues.length - 1]
        }`;

        if (unionValues.length > 2) {
          humanizedType = unionValues.join(', ');
        } else {
          humanizedType = unionValues.join(' ');
        }
        break;
      }
      humanizedType = type.value;
      break;

    default:
      humanizedType = type.name;
  }

  let typeMarkup;

  if (humanizedType) {
    typeMarkup = humanizedType;

    const functionMatches = [
      ...humanizedType.matchAll(/\([^=]*\) =>\s\w*\)*/g),
    ];

    const types = humanizedType.split(/\([^=]*\) =>\s\w*\)*/);

    if (functionMatches.length > 0) {
      let elements = '';
      let j = 0;
      for (let i = 0; i < types.length; i++) {
        if (functionMatches[j]) {
          elements =
            `${elements}` +
            `${types[i]}` +
            '\n' +
            `${functionMatches[j][0]}` +
            '\n';
          j++;
        } else {
          elements = `${elements}` + `${types[i]}` + '\n';
        }
      }
      typeMarkup = elements;
    }
  }

  return typeMarkup || humanizedType;
};

const getTooltip = (description, type, name) => (
  <span>
    <p>
      <b>{name}</b>: <i>{type}</i>
    </p>
    <p>{description}</p>
  </span>
);

const Label = ({ children, tooltip }) => {
  return (
    <EuiToolTip position="top" content={tooltip}>
      <>
        <span>{children}</span>
        <EuiSpacer size="s" />
      </>
    </EuiToolTip>
  );
};

const Knob = ({
  name,
  error: errorMsg,
  type,
  defaultValue,
  val,
  set,
  options = {},
  description,
  placeholder,
  custom,
  state,
  hidden,
  helpText,
}) => {
  const [error, setError] = useState(errorMsg);

  useEffect(() => {
    if (custom && custom.checkDep) {
      setError(custom.checkDep(val, state));
    }
  }, [state, val, custom]);

  let knobProps = {};
  switch (type) {
    case PropTypes.Ref:
      return (
        <>
          <Label tooltip={getTooltip(description, type, name)}>{name}</Label>
          <a
            href="https://reactjs.org/docs/refs-and-the-dom.html"
            target="_blank"
            style={{
              fontSize: '14px',
              display: 'block',
            }}
          >
            React Ref documentation
          </a>
          {error && <div>error {error}</div>}
        </>
      );

    case PropTypes.Number:
      return (
        <EuiFormRow
          isInvalid={error && error.length > 0}
          error={error}
          helpText={helpText}
          fullWidth
        >
          <EuiFieldNumber
            placeholder={placeholder}
            value={val ? val : undefined}
            onChange={(e) => set(e.target.value)}
            aria-label={description}
            compressed
            fullWidth
            isInvalid={error && error.length > 0}
          />
        </EuiFormRow>
      );

    case PropTypes.String:
    case PropTypes.Date:
      if (custom && custom.validator) {
        knobProps = {};
        knobProps.onChange = (e) => {
          const value = e.target.value;
          if (custom.validator(value)) set(value);
          else set(undefined);
        };
      } else if (custom && custom.sanitize) {
        knobProps = {};
        knobProps.value = val;
        knobProps.onChange = (e) => {
          const value = e.target.value;
          set(custom.sanitize(value));
        };
      } else {
        knobProps = {};
        knobProps.value = val;
        knobProps.onChange = (e) => {
          const value = e.target.value;
          set(value);
        };
      }

      return (
        <EuiFormRow
          isInvalid={error && error.length > 0}
          error={error}
          fullWidth
          helpText={
            <>
              {helpText}
              {custom && custom.helpText && (
                <>
                  <br />
                  {custom.helpText}
                </>
              )}
            </>
          }
        >
          <EuiFieldText
            aria-label={name}
            placeholder={placeholder}
            isInvalid={error && error.length > 0}
            compressed
            fullWidth
            {...knobProps}
          />
        </EuiFormRow>
      );

    case PropTypes.Boolean:
      return (
        <EuiFormRow
          fullWidth
          helpText={helpText}
          isInvalid={error && error.length > 0}
          error={error}
        >
          <EuiSwitch
            aria-label={name}
            id={name}
            label=""
            checked={val}
            onChange={(e) => {
              set(e.target.checked);
            }}
            compressed
          />
        </EuiFormRow>
      );

    case PropTypes.Enum:
      const optionsKeys = Object.keys(options);
      const numberOfOptions = optionsKeys.length;

      let valueKey = val || defaultValue;

      // When would numberOfOptions ever be less than 1?
      if (numberOfOptions < 1) {
        if (valueKey && !valueKey.includes('__')) {
          valueKey = `${valueKey}__${name}`;
        }
        const flattenedOptions = optionsKeys.map((key) => ({
          id: `${key}__${name}`,
          label: options[key],
        }));

        return (
          <>
            <EuiRadioGroup
              options={flattenedOptions}
              idSelected={valueKey}
              onChange={(id) => {
                let val = id;
                if (val.includes('__')) val = val.split('__')[0];
                set(val);
              }}
              name={`Select ${name}`}
            />
            {error && <div>error {error}</div>}
          </>
        );
      } else {
        const flattenedOptions = optionsKeys.map((key) => ({
          value: key,
          text: options[key],
        }));

        return (
          <EuiFormRow
            isInvalid={error && error.length > 0}
            helpText={helpText}
            error={error}
            fullWidth
          >
            <EuiSelect
              id={name}
              options={flattenedOptions}
              value={valueKey || defaultValue}
              onChange={(e) => {
                set(e.target.value);
              }}
              aria-label={`Select ${name}`}
              isInvalid={error && error.length > 0}
              compressed
              fullWidth
              hasNoInitialSelection={!valueKey && !defaultValue}
            />
          </EuiFormRow>
        );
      }

    case PropTypes.ReactNode:
      if (!hidden) {
        return (
          <EuiTextArea
            compressed
            placeholder={placeholder}
            value={val}
            onChange={(e) => {
              set(e.target.value);
            }}
          />
        );
      } else return helpText || null;

    case PropTypes.Custom:
      if (custom && custom.use) {
        switch (custom.use) {
          case 'switch':
            return (
              <>
                <EuiSwitch
                  aria-label={name}
                  id={name}
                  label={custom.label || ''}
                  checked={typeof val !== 'undefined' && Boolean(val)}
                  onChange={(e) => {
                    const value = e.target.checked;

                    set(value ? custom.value ?? e.target.checked : undefined);
                  }}
                  compressed
                />
              </>
            );
        }
      }

    case PropTypes.Function:
    case PropTypes.Array:
    case PropTypes.Object:
      return helpText || null;
    default:
      return helpText || assertUnreachable();
  }
};

const KnobColumn = ({ state, knobNames, error, set, isPlayground }) => {
  const codeBlockProps = {
    className: 'guideSection__tableCodeBlock',
    paddingSize: 'none',
    language: 'ts',
  };

  return knobNames.map((name, idx) => {
    /**
     * Prop name
     */
    let humanizedName = <strong className="eui-textBreakNormal">{name}</strong>;

    if (state[name].custom?.origin?.required) {
      humanizedName = (
        <>
          {humanizedName} <EuiTextColor color="danger">(required)</EuiTextColor>
        </>
      );
    } else if (state[name].description?.includes('@deprecated')) {
      humanizedName = (
        <>
          <s>{humanizedName}</s>{' '}
          <EuiTextColor color="subdued">(deprecated)</EuiTextColor>
        </>
      );
    }

    /**
     * TS Type
     */
    let typeMarkup;

    if (state[name].custom?.origin?.type) {
      const humanizedType = humanizeType(state[name].custom.origin.type);

      if (humanizedType) {
        typeMarkup = (
          <EuiCodeBlock {...codeBlockProps}>{humanizedType}</EuiCodeBlock>
        );
      }
    }

    /**
     * Default value
     */
    let defaultValueMarkup;
    if (state[name].custom?.origin?.defaultValue) {
      const defaultValue = state[name].custom.origin.defaultValue;
      defaultValueMarkup = (
        <EuiText size="xs">
          {isPlayground && defaultValue.value && 'Default: '}
          <EuiCode>{defaultValue.value}</EuiCode>
          {defaultValue.comment && (
            <>
              <br />({defaultValue.comment})
            </>
          )}
        </EuiText>
      );
    }

    return (
      <EuiTableRow key={name}>
        <EuiTableRowCell
          key={`prop__${name}-${idx}`}
          header="Prop"
          textOnly={false}
          mobileOptions={{
            header: false,
            width: '100%',
          }}
        >
          <div>
            <EuiTitle size="xxs">
              <span>{humanizedName}</span>
            </EuiTitle>
            {state[name].description && (
              <>
                <EuiSpacer size="xs" />

                {markup(state[name].description, isPlayground)}
              </>
            )}
          </div>
        </EuiTableRowCell>
        <EuiTableRowCell
          key={`type__${name}-${idx}`}
          header="Type"
          textOnly={false}
        >
          <div>{typeMarkup}</div>
        </EuiTableRowCell>
        <EuiTableRowCell
          key={`modify__${name}-${idx}`}
          header={isPlayground ? 'Modify' : 'Default value'}
          textOnly={false}
        >
          {isPlayground ? (
            <Knob
              key={name}
              name={name}
              error={error.where === name ? error.msg : null}
              description={state[name].description}
              type={state[name].type}
              val={state[name].value}
              hidden={state[name].hidden}
              options={state[name].options}
              placeholder={state[name].placeholder}
              set={(value) => set(value, name)}
              enumName={state[name].enumName}
              defaultValue={state[name].defaultValue}
              custom={state[name] && state[name].custom}
              state={state}
              orgSet={set}
              helpText={defaultValueMarkup}
            />
          ) : (
            defaultValueMarkup
          )}
        </EuiTableRowCell>
      </EuiTableRow>
    );
  });
};

const Knobs = ({ state, set, error, isPlayground = true }) => {
  const { euiTheme } = useEuiTheme();
  const isMobile = useIsWithinBreakpoints(['xs', 's']);
  const knobNames = Object.keys(state);

  const columns = [
    {
      field: 'prop',
      name: 'Prop',
    },
    {
      field: 'type',
      name: 'Type',
    },
  ];

  columns.push({
    field: isPlayground ? 'modify' : 'default',
    name: isPlayground ? 'Modify' : 'Default value',
    width: 200,
  });

  return (
    <div style={isMobile ? { padding: euiTheme.size.s } : undefined}>
      <EuiTable style={{ background: 'transparent' }}>
        <EuiTableHeader>
          {columns.map(({ name, width }, id) => {
            return (
              <EuiTableHeaderCell width={width} key={id}>
                {name}
              </EuiTableHeaderCell>
            );
          })}
        </EuiTableHeader>

        <EuiTableBody>
          <KnobColumn
            isPlayground={isPlayground}
            state={state}
            knobNames={knobNames}
            set={set}
            error={error}
          />
        </EuiTableBody>
      </EuiTable>
    </div>
  );
};

export default Knobs;
