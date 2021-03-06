var React = require('react');
var { DragSource, DropTarget } = require('react-dnd');
var flow = require('lodash/fp/flow');

const ItemTypes = { TAG: 'tag' };

var tagSource = {
    beginDrag(props) {
        return { id: props.tag.id }
    },
    canDrag(props) {
        return props.moveTag && !props.readOnly;
    }
};

var tagTarget = {
    hover(props, monitor) {
        var draggedId = monitor.getItem().id;
        if (draggedId !== props.id) {
            props.moveTag(draggedId, props.tag.id);
        }
    },
    canDrop(props) {
        return !props.readOnly;
    }
};

function dragSource(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

function dropCollect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget()
    }
}

var Tag = React.createClass({
    propTypes: {
        labelField: React.PropTypes.string,
        onDelete: React.PropTypes.func.isRequired,
        tag: React.PropTypes.object.isRequired,
        moveTag: React.PropTypes.func,
        removeComponent: React.PropTypes.func,
        classNames: React.PropTypes.object,
        readOnly: React.PropTypes.bool,
        connectDragSource: React.PropTypes.func.isRequired,
        isDragging: React.PropTypes.bool.isRequired,
        connectDropTarget: React.PropTypes.func.isRequired
    },
    getDefaultProps: function() {
        return {
            labelField: 'text',
            readOnly: false
        };
    },
    render: function(){
        var label = this.props.tag[this.props.labelField];
        var { connectDragSource, isDragging, connectDropTarget, readOnly } = this.props;
        var CustomRemoveComponent = this.props.removeComponent;
        var RemoveComponent = React.createClass({
          render: function() {
            if (readOnly) {
                return <span/>;
            }

            if (CustomRemoveComponent) {
              return <CustomRemoveComponent {...this.props} />;
            }
            return <a {...this.props}>&#10005;</a>;
          }
        });
        var tagComponent = (
            <span style={{opacity: isDragging ? 0 : 1}}
                  className={this.props.classNames.tag}>{label}
                <RemoveComponent className={this.props.classNames.remove}
                                 onClick={this.props.onDelete} />
            </span>
        );
        return connectDragSource(connectDropTarget(tagComponent));
    }
});

module.exports = flow(
    DragSource(ItemTypes.TAG, tagSource, dragSource),
    DropTarget(ItemTypes.TAG, tagTarget, dropCollect)
)(Tag);
