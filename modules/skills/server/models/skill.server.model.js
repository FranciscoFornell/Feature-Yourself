'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Skill Schema
 */
var SkillSchema = new Schema({
  name: {
    en: {
      type: String,
      default: '',
      trim: true,
      required: 'Please fill Profile name'
    },
    es: {
      type: String,
      default: '',
      trim: true,
      required: 'Please fill Profile name'
    }
  },
  level: {
    type: Number,
    default: 1
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

SkillSchema.index({
  _id: 1,
  profiles: 1
});

SkillSchema.pre('validate', function (next) {
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

mongoose.model('Skill', SkillSchema);
