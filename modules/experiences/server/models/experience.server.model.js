'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Experience Schema
 */
var ExperienceSchema = new Schema({
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
  company: {
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
  position: {
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
  duration: {
    start: {
      type: Date
    },
    end: {
      type: Date
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
  projects: [{
    type: String,
    default: '',
    trim: true
  }],
  mainAssignments: [{
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
  }],
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

ExperienceSchema.index({
  _id: 1,
  profiles: 1
});

ExperienceSchema.pre('validate', function (next) {
  var i,
    length,
    experience = this;

  if (experience.name.en === '' && experience.name.es !== '') {
    experience.name.en = experience.name.es;
  } else if ((experience.name.es === '' && experience.name.en !== '')) {
    experience.name.es = experience.name.en;
  }
  if (experience.description.en === '' && experience.description.es !== '') {
    experience.description.en = experience.description.es;
  } else if ((experience.description.es === '' && experience.description.en !== '')) {
    experience.description.es = experience.description.en;
  }
  if (experience.position.en === '' && experience.position.es !== '') {
    experience.position.en = experience.position.es;
  } else if ((experience.position.es === '' && experience.position.en !== '')) {
    experience.position.es = experience.position.en;
  }
  for (i = 0, length = experience.mainAssignments.length; i < length; i++) {
    if (experience.mainAssignments[i].en === '' && experience.mainAssignments[i].es !== '') {
      experience.mainAssignments[i].en = experience.mainAssignments[i].es;
    } else if ((experience.mainAssignments[i].es === '' && experience.mainAssignments[i].en !== '')) {
      experience.mainAssignments[i].es = experience.mainAssignments[i].en;
    }
  }

  next();
});

mongoose.model('Experience', ExperienceSchema);
