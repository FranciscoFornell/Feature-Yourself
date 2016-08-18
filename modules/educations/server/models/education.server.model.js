'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Education Schema
 */
var EducationSchema = new Schema({
  name: {
    en: {
      type: String,
      default: '',
      trim: true,
      required: 'Please fill Education name'
    },
    es: {
      type: String,
      default: '',
      trim: true,
      required: 'Please fill Education name'
    }
  },
  description: {
    en: {
      type: String,
      default: '',
      trim: true
    },
    es: {
      type: String,
      default: '',
      trim: true
    }
  },
  issuingAuthority: {
    name: {
      type: String,
      default: '',
      trim: true
    },
    web: {
      type: String,
      default: '',
      trim: true
    }
  },
  certificate: {
    type: String,
    default: '',
    trim: true
  },
  educationType: {
    type: String,
    default: 'ACADEMIC',
    enum: ['ACADEMIC', 'COURSE'],
    required: 'Please fill Education type'
  },
  icon: {
    type: String,
    default: ''
  },
  profiles:[{
    type: String,
    ref: 'Profile'
  }],
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

EducationSchema.index({
  _id: 1,
  profiles: 1
});

EducationSchema.pre('validate', function (next) {
  if (this.name.en === '' && this.name.es !== '') {
    this.name.en = this.name.es;
  } else if ((this.name.es === '' && this.name.en !== '')) {
    this.name.es = this.name.en;
  }
  if (this.description.en === '' && this.description.es !== '') {
    this.description.en = this.description.es;
  } else if ((this.description.es === '' && this.description.en !== '')) {
    this.description.es = this.description.en;
  }
  next();
});

mongoose.model('Education', EducationSchema);
