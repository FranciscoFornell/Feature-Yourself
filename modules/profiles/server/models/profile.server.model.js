'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Profile Schema
 */
var ProfileSchema = new Schema({
  _id:{
    type: String,
    default: 'empty',
  },
  name:{
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
  bio: {
    en:{
      type: String,
      default: ''
    },
    es: {
      type: String,
      default: ''
    }
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

ProfileSchema.index({
  _id: 1,
  name: 1
});

ProfileSchema.pre('validate', function (next) {
  if (this.name.en === '' && this.name.es !== '') {
    this.name.en = this.name.es;
  } else if ((this.name.es === '' && this.name.en !== '')) {
    this.name.es = this.name.en;
  }
  if (this.bio.en === '' && this.bio.es !== '') {
    this.bio.en = this.bio.es;
  } else if ((this.bio.es === '' && this.bio.en !== '')) {
    this.bio.es = this.bio.en;
  }
  next();
});

ProfileSchema.pre('save', function (next) {
  if(this._id === 'empty') {
    this._id = this.name.en.toLowerCase()
      .replace(/[^\w\s-]/g, '') // remove non-word [a-z0-9_], non-whitespace, non-hyphen characters
      .replace(/[\s_-]+/g, '-') // swap any length of whitespace, underscore, hyphen characters with a single -
      .replace(/^-+|-+$/g, ''); // remove leading, trailing -;
  }
  next();
});

ProfileSchema.pre('remove', function (next) {
  var profile = this;
  mongoose.model('Skill').update(
    { profiles: profile._id },
    { $pull: { profiles: profile._id } },
    { multi: true },
    next
  );
});

mongoose.model('Profile', ProfileSchema);
