'use strict'

import {
  setCommonFields,
  setItemName,
  arrayOrderedValues,
  arrayUnorderedValues,
  singleValue,
  parseBoolean,
  parseString,
  parseItems,
  parseArray,
  loadFields
} from '@/lib/parser'

/* global describe it expect */

describe('lib/parser', () => {
  describe('setCommonFields(schema, field)', () => {
    it('should successfully set common fields with default values', () => {
      const field = { attrs: {} }
      const schema = { type: 'string' }
      const expected = {
        schemaType: 'string',
        label: '',
        description: '',
        attrs: {
          value: '',
          required: false,
          disabled: false
        }
      }

      setCommonFields(schema, field)

      expect(field).toEqual(expected)
    })

    it('should successfully set common fields with filled schema', () => {
      const field = { attrs: { value: 'value' } }
      const schema = {
        type: 'string',
        title: 'title value',
        description: 'description value',
        required: true,
        disabled: true
      }
      const expected = {
        schemaType: 'string',
        label: 'title value',
        description: 'description value',
        attrs: {
          value: 'value',
          required: true,
          disabled: true
        }
      }

      setCommonFields(schema, field)

      expect(field).toEqual(expected)
    })

    it('should successfully set common fields with default schema value', () => {
      const field = { attrs: {} }
      const schema = {
        type: 'string',
        default: 'value'
      }
      const expected = {
        schemaType: 'string',
        label: '',
        description: '',
        attrs: {
          value: 'value',
          required: false,
          disabled: false
        }
      }

      setCommonFields(schema, field)

      expect(field).toEqual(expected)
    })
  })

  describe('setItemName(field)', () => {
    it('should successfully set the item names', () => {
      const name = 'field-name'
      const items = [
        { name: 'item1', label: 'label 0', value: 0 },
        { label: 'label 1', value: 1 }
      ]
      const expected = [
        { name: 'item1', label: 'label 0', value: 0, ref: `${name}-0` },
        { name: 'field-name-label-1', label: 'label 1', value: 1, ref: `${name}-1` }
      ]
      const result = items.map(setItemName(name))

      expect(result).toEqual(expected)
    })

    it('should successfully set the item names with the missing field name', () => {
      const name = undefined
      const items = [
        { name: 'item1', label: 'label 0', value: 0 },
        { label: 'label 1', value: 1 }
      ]
      const expected = [
        { name: 'item1', label: 'label 0', value: 0 },
        { name: 'label-1', label: 'label 1', value: 1 }
      ]
      const result = items.map(setItemName(name))

      expect(result).toEqual(expected)
    })

    it('should successfully set the item names with isRadio === true', () => {
      const name = 'radio-field-name'
      const items = [
        { name: 'item1', label: 'label 0', value: 0 },
        { label: 'label 1', value: 1 }
      ]
      const expected = [
        { name, label: 'label 0', value: 0, ref: `${name}-0` },
        { name, label: 'label 1', value: 1, ref: `${name}-1` }
      ]
      const result = items.map(setItemName(name, true))

      expect(result).toEqual(expected)
    })
  })

  describe('arrayOrderedValues(field)', () => {
    it('should return the right array values', () => {
      const field = {
        items: [
          { label: 'l0', value: 0 },
          { label: 'l1', value: 1, checked: true },
          { label: 'l2', value: 2, checked: false }
        ]
      }
      const expected = [undefined, 1, undefined]

      expect(arrayOrderedValues(field)).toEqual(expected)
    })
  })

  describe('arrayUnorderedValues(field)', () => {
    it('should return the right array values', () => {
      const field = {
        items: [
          { label: 'l0', value: 0 },
          { label: 'l1', value: 1, checked: true },
          { label: 'l2', value: 2, checked: false },
          { label: 'l3', value: 3, selected: true }
        ]
      }
      const expected = [1, 3]

      expect(arrayUnorderedValues(field)).toEqual(expected)
    })
  })

  describe('singleValue(field)', () => {
    it('should return the last selected value', () => {
      const field = {
        items: [
          { label: 'l0', value: 0 },
          { label: 'l1', value: 1, checked: true },
          { label: 'l2', value: 2, checked: false },
          { label: 'l3', value: 3, selected: false }
        ]
      }
      const expected = 1

      expect(singleValue(field)).toEqual(expected)
    })
  })

  describe('parseBoolean(schema, name = null)', () => {
    it('should successfully parse an empty schema', () => {
      const schema = { type: 'boolean' }
      const expected = {
        schemaType: 'boolean',
        label: '',
        description: '',
        attrs: {
          type: 'checkbox',
          checked: false,
          required: false,
          disabled: false
        }
      }

      expect(parseBoolean(schema)).toEqual(expected)
    })

    it('should successfully parse with custom input type', () => {
      const schema = {
        type: 'boolean',
        attrs: {
          type: 'radio'
        }
      }
      const expected = {
        schemaType: 'boolean',
        label: '',
        description: '',
        attrs: {
          type: 'radio',
          checked: false,
          required: false,
          disabled: false
        }
      }

      expect(parseBoolean(schema)).toEqual(expected)
    })

    it('should successfully parse with defined checked falsely value', () => {
      const schema = {
        type: 'boolean',
        attrs: {
          type: 'radio',
          checked: false
        }
      }
      const expected = {
        schemaType: 'boolean',
        label: '',
        description: '',
        attrs: {
          name: 'name',
          type: 'radio',
          checked: false,
          required: false,
          disabled: false
        }
      }

      expect(parseBoolean(schema, 'name')).toEqual(expected)
    })

    it('should successfully parse with defined default value', () => {
      const schema = {
        type: 'boolean',
        default: true,
        attrs: {
          type: 'radio'
        }
      }
      const expected = {
        schemaType: 'boolean',
        label: '',
        description: '',
        attrs: {
          name: 'name',
          type: 'radio',
          checked: true,
          required: false,
          disabled: false
        }
      }

      expect(parseBoolean(schema, 'name')).toEqual(expected)
    })

    it('should successfully parse with defined input name', () => {
      const schema = {
        type: 'boolean',
        attrs: {
          type: 'radio'
        }
      }
      const expected = {
        schemaType: 'boolean',
        label: '',
        description: '',
        attrs: {
          name: 'name',
          type: 'radio',
          checked: false,
          required: false,
          disabled: false
        }
      }

      expect(parseBoolean(schema, 'name')).toEqual(expected)
    })
  })

  describe('parseString(schema, name = null)', () => {
    it('should successfully parse an empty schema', () => {
      const schema = { type: 'string' }
      const expected = {
        schemaType: 'string',
        label: '',
        description: '',
        attrs: {
          type: 'text',
          value: '',
          required: false,
          disabled: false
        }
      }

      expect(parseString(schema)).toEqual(expected)
    })

    it('should successfully parse with custom input type', () => {
      const schema = {
        type: 'string',
        attrs: {
          type: 'file'
        }
      }
      const expected = {
        schemaType: 'string',
        label: '',
        description: '',
        attrs: {
          type: 'file',
          value: '',
          required: false,
          disabled: false
        }
      }

      expect(parseString(schema)).toEqual(expected)
    })

    it('should successfully parse with defined input name', () => {
      const schema = {
        type: 'string',
        attrs: {
          type: 'file'
        }
      }
      const expected = {
        schemaType: 'string',
        label: '',
        description: '',
        attrs: {
          name: 'name',
          type: 'file',
          value: '',
          required: false,
          disabled: false
        }
      }

      expect(parseString(schema, 'name')).toEqual(expected)
    })

    it('should successfully parse with filled schema', () => {
      const schema = {
        type: 'string',
        minLength: 2,
        maxLength: 5,
        pattern: '[a-z]+'
      }
      const expected = {
        schemaType: 'string',
        label: '',
        description: '',
        attrs: {
          type: 'text',
          value: '',
          minlength: 2,
          maxlength: 5,
          pattern: '[a-z]+',
          required: false,
          disabled: false
        }
      }

      expect(parseString(schema)).toEqual(expected)
    })

    it('should successfully parse with defined format.email', () => {
      const schema = {
        type: 'string',
        format: 'email'
      }
      const expected = {
        schemaType: 'string',
        label: '',
        description: '',
        attrs: {
          type: 'email',
          value: '',
          required: false,
          disabled: false
        }
      }

      expect(parseString(schema)).toEqual(expected)

      schema.attrs = { type: 'text' }
      expected.attrs.type = 'text'

      expect(parseString(schema)).toEqual(expected)
    })

    it('should successfully parse with defined format.uri', () => {
      const schema = {
        type: 'string',
        format: 'uri'
      }
      const expected = {
        schemaType: 'string',
        label: '',
        description: '',
        attrs: {
          type: 'url',
          value: '',
          required: false,
          disabled: false
        }
      }

      expect(parseString(schema)).toEqual(expected)

      schema.attrs = { type: 'text' }
      expected.attrs.type = 'text'

      expect(parseString(schema)).toEqual(expected)
    })

    it('should successfully parse with schema.type === number', () => {
      const schema = { type: 'number' }
      const expected = {
        schemaType: 'number',
        label: '',
        description: '',
        attrs: {
          type: 'number',
          value: '',
          required: false,
          disabled: false
        }
      }

      expect(parseString(schema)).toEqual(expected)
    })

    it('should successfully parse with schema.type === integer', () => {
      const schema = { type: 'integer' }
      const expected = {
        schemaType: 'integer',
        label: '',
        description: '',
        attrs: {
          type: 'number',
          value: '',
          required: false,
          disabled: false
        }
      }

      expect(parseString(schema)).toEqual(expected)
    })
  })

  describe('parseItems(items)', () => {
    it('should successfully parse array with object items', () => {
      const items = [{ value: 'v', label: 'l' }]

      expect(parseItems(items)).toEqual(items)
    })

    it('should successfully parse array with non object items', () => {
      const items = ['a', 'b']
      const expected = [
        { value: 'a', label: 'a' },
        { value: 'b', label: 'b' }
      ]

      expect(parseItems(items)).toEqual(expected)
    })
  })

  describe('parseArray(schema, name = null)', () => {
    it('should successfully parse an empty schema', () => {
      const schema = { type: 'array' }
      const expected = {
        schemaType: 'array',
        label: '',
        description: '',
        isArrayField: true,
        items: [],
        minItems: 1,
        maxItems: 1000,
        attrs: {
          type: 'text',
          value: '',
          required: false,
          disabled: false
        }
      }

      expect(parseArray(schema)).toEqual(expected)
    })

    it('should successfully parse with custom input type', () => {
      const schema = {
        type: 'array',
        attrs: {
          type: 'file'
        }
      }
      const expected = {
        schemaType: 'array',
        label: '',
        description: '',
        items: [],
        minItems: 1,
        maxItems: 1000,
        attrs: {
          type: 'file',
          value: '',
          required: false,
          disabled: false
        }
      }

      expect(parseArray(schema)).toEqual(expected)
    })

    it('should successfully parse with defined input name', () => {
      const schema = { type: 'array' }
      const expected = {
        schemaType: 'array',
        label: '',
        description: '',
        isArrayField: true,
        items: [],
        minItems: 1,
        maxItems: 1000,
        attrs: {
          name: 'name',
          type: 'text',
          value: '',
          required: false,
          disabled: false
        }
      }

      expect(parseArray(schema, 'name')).toEqual(expected)
    })

    it('should successfully parse with filled schema', () => {
      const schema = {
        type: 'array',
        minItems: 2,
        maxItems: 5,
        attrs: {
          type: 'select'
        }
      }
      const expected = {
        schemaType: 'array',
        label: '',
        description: '',
        isArrayField: true,
        items: [],
        minItems: 2,
        maxItems: 5,
        attrs: {
          type: 'select',
          value: [],
          required: false,
          disabled: false,
          multiple: true
        }
      }

      expect(parseArray(schema)).toEqual(expected)
    })

    it('should successfully parse with defined schema.enum', () => {
      const schema = {
        type: 'array',
        enum: [{ value: 'v', label: 'l' }],
        attrs: {
          type: 'text'
        }
      }
      const expected = {
        schemaType: 'array',
        label: '',
        description: '',
        minItems: 1,
        maxItems: 1000,
        items: [{ value: 'v', label: 'l' }],
        attrs: {
          type: 'text',
          value: [],
          required: false,
          disabled: false
        }
      }

      expect(parseArray(schema)).toEqual(expected)

      delete schema.attrs

      expected.isArrayField = true,
      expected.attrs.type = 'select'
      expected.attrs.multiple = true

      expect(parseArray(schema)).toEqual(expected)
    })

    it('should successfully parse with defined schema.oneOf', () => {
      const schema = {
        type: 'array',
        oneOf: [{ value: 'v', label: 'l' }]
      }
      const expected = {
        schemaType: 'array',
        label: '',
        description: '',
        minItems: 1,
        maxItems: 1000,
        items: [{ value: 'v', label: 'l', name: 'l' }],
        attrs: {
          type: 'radio',
          value: '',
          required: false,
          disabled: false
        }
      }

      expect(parseArray(schema)).toEqual(expected)
    })

    it('should successfully parse with defined schema.anyOf', () => {
      const schema = {
        type: 'array',
        anyOf: [{ value: 'v', label: 'l' }]
      }
      const expected = {
        schemaType: 'array',
        label: '',
        description: '',
        isArrayField: true,
        minItems: 1,
        maxItems: 1000,
        items: [{ value: 'v', label: 'l', name: 'l' }],
        attrs: {
          type: 'checkbox',
          value: [undefined],
          required: false,
          disabled: false
        }
      }

      expect(parseArray(schema)).toEqual(expected)
    })
  })

  describe('loadFields(schema, fields, name = null)', () => {
    it('should ignore schema.visible === false', () => {
      const fields = []
      const schema = { type: 'boolean', visible: false }
      const expected = []

      loadFields(schema, fields)

      expect(fields).toEqual(expected)
    })

    describe('schema.type === boolean', () => {
      it('should successfully load the schema', () => {
        const fields = []
        const schema = { type: 'boolean' }
        const expected = [{
          schemaType: 'boolean',
          label: '',
          description: '',
          attrs: {
            type: 'checkbox',
            checked: false,
            required: false,
            disabled: false
          }
        }]

        loadFields(schema, fields)

        expect(fields).toEqual(expected)
      })
    })

    describe('schema.type === array', () => {
      it('should successfully load the schema', () => {
        const fields = []
        const schema = { type: 'array' }
        const expected = [{
          schemaType: 'array',
          label: '',
          description: '',
          isArrayField: true,
          items: [],
          minItems: 1,
          maxItems: 1000,
          attrs: {
            type: 'text',
            value: '',
            required: false,
            disabled: false
          }
        }]

        loadFields(schema, fields)

        expect(fields).toEqual(expected)
      })
    })

    describe('schema.type === integer', () => {
      it('should successfully load the schema', () => {
        const fields = []
        const schema = { type: 'integer' }
        const expected = [{
          schemaType: 'integer',
          label: '',
          description: '',
          attrs: {
            type: 'number',
            value: '',
            required: false,
            disabled: false
          }
        }]

        loadFields(schema, fields)

        expect(fields).toEqual(expected)
      })
    })

    describe('schema.type === string', () => {
      it('should successfully load the schema', () => {
        const fields = []
        const schema = {
          type: 'string',
          enum: [{ value: 'v', label: 'l' }]
        }
        const expected = [{
          schemaType: 'string',
          label: '',
          description: '',
          minItems: 1,
          maxItems: 1000,
          items: [{ value: 'v', label: 'l' }],
          attrs: {
            type: 'select',
            value: '',
            required: false,
            disabled: false,
            multiple: false
          }
        }]

        loadFields(schema, fields)

        expect(fields).toEqual(expected)
      })

      it('should successfully load the schema with stringify enum values', () => {
        const fields = []
        const schema = {
          type: 'string',
          enum: ['v']
        }
        const expected = [{
          schemaType: 'string',
          label: '',
          description: '',
          minItems: 1,
          maxItems: 1000,
          items: [{ value: 'v', label: 'v' }],
          attrs: {
            type: 'select',
            value: '',
            required: false,
            disabled: false,
            multiple: false
          }
        }]

        loadFields(schema, fields)

        expect(fields).toEqual(expected)
      })
    })

    describe('schema.type === object', () => {
      it('should successfully load a scalar field', () => {
        const fields = []
        const schema = {
          type: 'object',
          properties: {
            bool: { type: 'boolean' }
          }
        }
        const expected = [{
          schemaType: 'boolean',
          label: '',
          description: '',
          attrs: {
            type: 'checkbox',
            name: 'bool',
            checked: false,
            required: false,
            disabled: false
          }
        }]

        loadFields(schema, fields)

        expect(fields).toEqual(expected)
      })

      it('should successfully load array string field', () => {
        const fields = []
        const schema = {
          type: 'object',
          properties: {
            string: {
              type: 'string',
              enum: ['v']
            }
          }
        }
        const expected = [{
          schemaType: 'string',
          label: '',
          description: '',
          minItems: 1,
          maxItems: 1000,
          items: [{ value: 'v', label: 'v' }],
          attrs: {
            type: 'select',
            name: 'string',
            value: '',
            required: false,
            disabled: false,
            multiple: false
          }
        }]

        loadFields(schema, fields)

        expect(fields).toEqual(expected)
      })

      it('should successfully load the schema with required fields', () => {
        const fields = []
        const schema = {
          type: 'object',
          properties: {
            bool: { type: 'boolean' }
          },
          required: ['bool']
        }
        const expected = [{
          schemaType: 'boolean',
          label: '',
          description: '',
          attrs: {
            type: 'checkbox',
            name: 'bool',
            checked: false,
            required: true,
            disabled: false
          }
        }]

        loadFields(schema, fields)

        expect(fields).toEqual(expected)
      })
    })
  })
})
